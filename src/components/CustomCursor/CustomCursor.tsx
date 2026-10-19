import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, hasFinePointer, prefersReducedMotion } from '../../lib/gsap';
import styles from './CustomCursor.module.css';

type Mode = 'default' | 'link' | 'view' | 'hidden';

/** Dot + trailing ring. Elements opt into the "view" state with data-cursor="view" (label from data-cursor-label). */
export function CustomCursor() {
  const [enabled] = useState(hasFinePointer);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('hidden');
  const [label, setLabel] = useState('View project');
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');
    const slow = prefersReducedMotion() ? 0 : 0.55;
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: slow, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: slow, ease: 'power3' });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        visible = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        setMode((m) => (m === 'hidden' ? 'default' : m));
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element;
      const view = t.closest<HTMLElement>('[data-cursor="view"]');
      if (view) { setLabel(view.dataset.cursorLabel ?? 'View project'); setMode('view'); return; }
      if (t.closest('input, textarea')) { setMode('hidden'); return; }
      if (t.closest('a, button, [role="button"], label')) { setMode('link'); return; }
      setMode('default');
    };
    const leave = () => { visible = false; setMode('hidden'); };
    const down = () => gsap.to(ring.current, { scale: 0.85, duration: 0.2 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4 });

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled]);

  // After a route change the element under the pointer is gone; fall back to the default state.
  useEffect(() => { setMode((m) => (m === 'hidden' ? m : 'default')); }, [location.pathname]);

  if (!enabled) return null;
  return (
    <div className={styles.root} data-mode={mode} aria-hidden="true">
      <div ref={ring} className={styles.ring}>
        <span className={styles.ringInner}><span className={styles.label}>{label}</span></span>
      </div>
      <div ref={dot} className={styles.dot} />
    </div>
  );
}
