import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/gsap';
import styles from './Transition.module.css';

interface GoOptions {
  /** Element whose image expands to fill the screen (project cards). */
  from?: HTMLElement | null;
  /** object-position the expanded image should settle on (matches the destination hero). */
  position?: string;
  /** Section id to land on after navigating to the home page. */
  section?: string;
}

interface TransitionApi {
  go: (to: string, opts?: GoOptions) => void;
  goSection: (id: string) => void;
  /** Calls `cb` when the incoming page becomes visible (immediately if no transition is running). */
  onEnter: (cb: () => void) => () => void;
}

const Ctx = createContext<TransitionApi | null>(null);

export const useTransition = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTransition must be used inside <TransitionProvider>');
  return ctx;
};

export function scrollToId(id: string, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto' });
}

/** Runs the callback once the page is revealed. Use for entrance animations. */
export function usePageEnter(cb: () => void, deps: unknown[] = []) {
  const { onEnter } = useTransition();
  useLayoutEffect(() => onEnter(cb), deps); // eslint-disable-line react-hooks/exhaustive-deps
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const curtain = useRef<HTMLDivElement>(null);
  const clone = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const waiting = useRef(new Set<() => void>());
  const afterCommit = useRef<(() => void) | null>(null);

  const reveal = () => {
    const cbs = [...waiting.current];
    waiting.current.clear();
    cbs.forEach((cb) => cb());
  };

  const onEnter = useCallback((cb: () => void) => {
    if (!busy.current) { cb(); return () => {}; }
    waiting.current.add(cb);
    return () => { waiting.current.delete(cb); };
  }, []);

  const land = (to: string, section?: string) => {
    navigate(to, { state: section ? { section } : undefined });
  };

  // Runs once the new route has rendered (navigation may be deferred by startTransition).
  useLayoutEffect(() => {
    const fn = afterCommit.current;
    afterCommit.current = null;
    fn?.();
  }, [location.key]);

  const go = useCallback((to: string, opts: GoOptions = {}) => {
    if (busy.current) return;
    const samePage = to === location.pathname;
    if (samePage && opts.section) { scrollToId(opts.section); return; }
    if (samePage) { scrollToId('top'); return; }

    if (prefersReducedMotion()) {
      afterCommit.current = () => { if (!opts.section) window.scrollTo(0, 0); };
      land(to, opts.section);
      return;
    }

    busy.current = true;
    const c = curtain.current!, k = clone.current!;
    const img = opts.from?.querySelector('img');
    const tl = gsap.timeline({ defaults: { ease: 'atelier' } });

    const finish = () => {
      // Two frames: React commits the new route, then layout settles.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        busy.current = false;
        reveal();
      }));
    };

    if (img && opts.from) {
      const r = opts.from.getBoundingClientRect();
      const im = k.querySelector('img')!;
      im.src = img.currentSrc || img.src;
      gsap.set(im, { objectPosition: getComputedStyle(img).objectPosition });
      gsap.set(k, { display: 'block', top: r.top, left: r.left, width: r.width, height: r.height, opacity: 1 });
      gsap.set(c, { display: 'block', clipPath: 'inset(0% 0% 0% 0%)', opacity: 0 });
      gsap.set(c.firstElementChild, { opacity: 0 });
      tl.to(c, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to(k, { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight, duration: 1.15 }, 0)
        .to(im, { objectPosition: opts.position ?? '50% 50%', duration: 1.15 }, 0)
        .add(() => {
          tl.pause();
          afterCommit.current = () => {
            window.scrollTo(0, 0);
            gsap.set(c, { display: 'none' });
            finish();
            tl.play();
          };
          land(to, opts.section);
        })
        .to(k, { opacity: 0, duration: 0.9, ease: 'power2.inOut', delay: 0.25 })
        .set(k, { display: 'none' });
    } else {
      gsap.set(c, { display: 'block', opacity: 1, clipPath: 'inset(100% 0% 0% 0%)' });
      tl.to(c, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8 })
        .fromTo(c.firstElementChild, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3)
        .add(() => {
          tl.pause();
          afterCommit.current = () => {
            if (!opts.section) window.scrollTo(0, 0);
            finish();
            tl.play();
          };
          land(to, opts.section);
        })
        .to(c.firstElementChild, { opacity: 0, duration: 0.3, ease: 'power1.in' }, '+=0.1')
        .to(c, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.95 }, '<')
        .set(c, { display: 'none' });
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const goSection = useCallback((id: string) => go('/', { section: id }), [go]);
  const api = useMemo(() => ({ go, goSection, onEnter }), [go, goSection, onEnter]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div ref={curtain} className={styles.curtain} aria-hidden="true">
        <span className={styles.mark}>NOCTURNE<em>— digital atelier</em></span>
      </div>
      <div ref={clone} className={styles.clone} aria-hidden="true">
        <img alt="" />
      </div>
    </Ctx.Provider>
  );
}
