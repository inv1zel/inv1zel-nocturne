import { useRef, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkle } from '../components/Manifesto/Manifesto';
import { Chars } from '../components/Mask/Mask';
import { usePageEnter, useTransition } from '../components/Transition/Transition';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import styles from './NotFound.module.css';
import { routeHref } from '../lib/paths';

export default function NotFound() {
  const root = useRef<HTMLElement>(null);
  const { go } = useTransition();
  const { pathname } = useLocation();
  useDocumentTitle('Not found · NOCTURNE');

  usePageEnter(() => {
    if (prefersReducedMotion() || !root.current) return;
    const q = gsap.utils.selector(root.current);
    gsap.from(q('[data-char]'), { yPercent: 115, duration: 1.4, stagger: 0.08 });
    gsap.from(q('[data-fade]'), { opacity: 0, y: 16, duration: 1, stagger: 0.1, delay: 0.4, ease: 'power3.out' });
  });

  const home = (e: MouseEvent) => { e.preventDefault(); go('/'); };

  return (
    <section ref={root} id="top" className={styles.page} aria-labelledby="nf-title">
      <span className="micro" data-fade>Error 404</span>
      <h1 id="nf-title" className={styles.code}><Chars text="404" /></h1>
      <Sparkle className={styles.sparkle} />
      <p className={styles.text} data-fade>This page dissolved into the night.</p>
      <p className={`micro ${styles.path}`} data-fade>{pathname}</p>
      <a href={routeHref('/')} onClick={home} className={styles.link} data-fade>
        <span>Return to the atelier</span>
        <svg viewBox="0 0 36 10" aria-hidden="true"><path d="M0 5h34M30 1l4 4-4 4" fill="none" stroke="currentColor" /></svg>
      </a>
    </section>
  );
}
