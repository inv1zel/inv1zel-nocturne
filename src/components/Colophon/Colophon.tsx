import { useRef } from 'react';
import { site } from '../../config/site';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useGsap } from '../../lib/useGsap';
import { Art } from '../Art/Art';
import { Lines } from '../Mask/Mask';
import { Sparkle } from '../Manifesto/Manifesto';
import { scrollToId } from '../Transition/Transition';
import styles from './Colophon.module.css';

const FACTS = [
  { k: 'Status', v: 'Concept project — not a real studio' },
  { k: 'Clients & projects', v: 'Invented for this portfolio' },
  { k: 'Imagery', v: 'Generated in-house with GLSL — no stock, no real people' },
  { k: 'Typefaces', v: 'Cormorant Garamond, Inter, JetBrains Mono' },
  { k: 'Built with', v: 'React, TypeScript, Vite, GSAP' },
  { k: 'Data', v: 'No forms, no tracking, nothing is collected' },
];

export function Colophon() {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    // The site quietens as you arrive: grain and contrast drop, the colonnade surfaces from the dark.
    const dim = gsap.fromTo(document.documentElement, { '--intensity': 1 }, {
      '--intensity': 0.25, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true },
    });
    const reset = () => { gsap.set(document.documentElement, { '--intensity': 1 }); };
    if (prefersReducedMotion()) return () => { dim.scrollTrigger?.kill(); reset(); };

    gsap.fromTo(q('[data-bg]'), { opacity: 0, scale: 1.12 }, {
      opacity: 1, scale: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'top top', scrub: true },
    });
    const st = { trigger: q('h2')[0], start: 'top 80%', once: true };
    gsap.from(q('[data-line]'), { yPercent: 110, duration: 1.6, stagger: 0.14, scrollTrigger: st });
    gsap.from(q('[data-fade]'), { opacity: 0, y: 20, duration: 1.2, stagger: 0.08, ease: 'power3.out', delay: 0.5, scrollTrigger: st });
    gsap.from(q('[data-rule]'), { scaleX: 0, duration: 1.4, stagger: 0.06, ease: 'atelier', scrollTrigger: { trigger: q('[data-facts]')[0], start: 'top 85%', once: true } });
    return reset;
  }, root);

  return (
    <section ref={root} id="info" className={styles.section} aria-label="About this project">
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgInner} data-bg>
          <Art name="corridor" alt="" sizes="100vw" />
        </div>
      </div>

      <div className={styles.head}>
        <span className="micro">(04)</span>
        <span className="micro">Colophon</span>
        <span className={styles.headRule} />
        <span className="micro">Fiction</span>
      </div>

      <Lines
        as="h2"
        className={styles.title}
        label="An atelier that exists only at night."
        lines={['An atelier', <em key="e">that exists</em>, 'only at night.']}
      />
      <Sparkle className={styles.sparkle} />

      <div className={styles.grid}>
        <div className={styles.note}>
          <p className="micro" data-fade>Disclaimer</p>
          <p className={styles.lead} data-fade>
            NOCTURNE does not exist. This site is a concept portfolio piece — an exercise in art direction,
            typography and motion design.
          </p>
          <p className={styles.body} data-fade>
            The studio, its clients, projects, quotes and figures are invented. Every image was rendered
            procedurally for this project. Any resemblance to real companies or people is coincidental.
          </p>
          <div className={styles.actions} data-fade>
            <button type="button" className={styles.action} onClick={() => scrollToId('projects')}>
              <span>Revisit the projects</span>
              <svg viewBox="0 0 36 10" aria-hidden="true"><path d="M0 5h34M30 1l4 4-4 4" fill="none" stroke="currentColor" /></svg>
            </button>
            <button type="button" className={styles.action} onClick={() => scrollToId('top')}>
              <span>Back to the beginning</span>
              <svg viewBox="0 0 10 36" aria-hidden="true"><path d="M5 36V2M1 6l4-4 4 4" fill="none" stroke="currentColor" /></svg>
            </button>
          </div>
        </div>

        <dl className={styles.facts} data-facts aria-label="Colophon">
          {FACTS.map((f) => (
            <div key={f.k} className={styles.fact} data-fade>
              <span className={styles.factRule} data-rule />
              <dt className="micro">{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className={styles.sign} data-fade aria-hidden="true">{site.name}</p>
    </section>
  );
}
