import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../../config/site';
import { projects } from '../../data/projects';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/gsap';
import { useTransition } from '../Transition/Transition';
import styles from './Header.module.css';
import { routeHref } from '../../lib/paths';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'info', label: 'Info' },
];

export function Header() {
  const { go, goSection } = useTransition();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline>();
  const quietUntil = useRef(0);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        if (performance.now() < quietUntil.current) return; // ignore programmatic jumps after navigation
        setHidden(self.direction === 1 && self.scroll() > window.innerHeight * 0.6);
        setScrolled(self.scroll() > 40);
      },
    });
    return () => st.kill();
  }, []);

  // Menu open/close timeline.
  useEffect(() => {
    const m = menu.current!;
    const links = m.querySelectorAll('[data-menu-line]');
    const meta = m.querySelectorAll('[data-menu-meta]');
    gsap.set(m, { clipPath: 'inset(0% 0% 100% 0%)', visibility: 'hidden' });
    tl.current = gsap.timeline({ paused: true, defaults: { ease: 'atelier' } })
      .set(m, { visibility: 'visible' })
      .to(m, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 })
      .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'reveal' }, 0.35)
      .fromTo(meta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out' }, 0.6);
    return () => { tl.current?.kill(); };
  }, []);

  useEffect(() => {
    const t = tl.current; if (!t) return;
    document.body.classList.toggle('is-locked', open);
    menu.current!.inert = !open;
    if (open) {
      prefersReducedMotion() ? t.progress(1) : t.timeScale(1).play();
      requestAnimationFrame(() => menu.current?.querySelector<HTMLElement>('a, button')?.focus());
    } else if (t.progress() > 0) {
      prefersReducedMotion() ? t.progress(0) : t.timeScale(1.6).reverse();
    }
  }, [open]);

  // Close the menu and show the bar on every navigation.
  useEffect(() => {
    setOpen(false);
    setHidden(false);
    quietUntil.current = performance.now() + 1200;
  }, [location.key]);

  // Escape + focus trap while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); return; }
      if (e.key !== 'Tab') return;
      const nodes = [toggle.current!, ...menu.current!.querySelectorAll<HTMLElement>('a, button')];
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const toSection = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    if (wasOpen && location.pathname === '/') setTimeout(() => goSection(id), 500);
    else goSection(id);
  };
  const toPath = (to: string) => (e: MouseEvent) => {
    e.preventDefault();
    if (open && location.pathname === to) { setOpen(false); return; }
    go(to);
  };

  return (
    <header ref={root} className={styles.header} data-hidden={(hidden && !open) || undefined} data-open={open || undefined} data-scrolled={scrolled || undefined}>
      <div className={styles.bar}>
        <a href={routeHref('/')} className={styles.logo} onClick={toSection('top')} data-intro="header" aria-label="NOCTURNE — home">
          NOCTURNE
        </a>
        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.id} href={routeHref('/', n.id)} onClick={toSection(n.id)} className={styles.navLink} data-intro="header">
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
        <button
          ref={toggle}
          className={styles.toggle}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="site-menu"
          data-intro="header"
        >
          <span className={styles.toggleText}>{open ? 'Close' : 'Menu'}</span>
          <span className={styles.toggleIcon} aria-hidden="true" />
        </button>
      </div>

      <div ref={menu} id="site-menu" className={styles.menu} role="dialog" aria-modal="true" aria-label="Site menu">
        <div className={styles.menuInner}>
          <ol className={styles.menuList}>
            {[{ id: 'top', label: 'Index' }, ...NAV].map((n, i) => (
              <li key={n.id} className="mask">
                <a href={routeHref('/', n.id)} onClick={toSection(n.id)} className={styles.menuLink} data-menu-line>
                  <span className={styles.menuNum}>0{i + 1}</span>
                  <span className={styles.menuLabel}>{n.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className={styles.menuAside}>
            <p className="micro" data-menu-meta>Selected projects</p>
            <ul className={styles.menuProjects}>
              {projects.map((p) => (
                <li key={p.slug} data-menu-meta>
                  <a href={routeHref(`/projects/${p.slug}`)} onClick={toPath(`/projects/${p.slug}`)}>
                    <span>{p.index}</span> {p.category}
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.menuNote} data-menu-meta>{site.disclaimer}</p>
          </div>
        </div>
        <div className={styles.menuFoot}>
          <span className="micro" data-menu-meta>© {new Date().getFullYear()} {site.name}</span>
          <span className="micro" data-menu-meta>{site.tagline}</span>
        </div>
      </div>
    </header>
  );
}
