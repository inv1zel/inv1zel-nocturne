import { useRef } from 'react';
import { site } from '../../config/site';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useGsap } from '../../lib/useGsap';
import { Art } from '../Art/Art';
import { Lines } from '../Mask/Mask';
import { scrollToId } from '../Transition/Transition';
import styles from './Manifesto.module.css';

const PRINCIPLES = [
  { n: '01', t: 'Form', d: 'We begin with silhouette. If an idea does not survive as a shape in the dark, it is not ready.' },
  { n: '02', t: 'Light', d: 'Colour is a decision we rarely make. Contrast, shadow and reflection carry the brand.' },
  { n: '03', t: 'Motion', d: 'Every transition has a reason. Movement is how an interface breathes, not how it shouts.' },
];

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" data-sparkle>
      <path d="M20 0 L20.6 19.4 L40 20 L20.6 20.6 L20 40 L19.4 20.6 L0 20 L19.4 19.4 Z" fill="currentColor" />
    </svg>
  );
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    const st = (trigger: Element | string, start = 'top 80%') => ({ trigger, start, once: true });

    gsap.from(q('[data-line]'), { yPercent: 110, duration: 1.4, stagger: 0.12, scrollTrigger: st(q('h2')[0]) });
    gsap.from(q('[data-fade]'), { opacity: 0, y: 24, duration: 1.2, stagger: 0.12, delay: 0.35, ease: 'power3.out', scrollTrigger: st(q('h2')[0]) });
    gsap.from(q('[data-rule]'), { scaleX: 0, duration: 1.8, ease: 'atelier', stagger: 0.1, scrollTrigger: st(root.current!, 'top 75%') });
    gsap.from(q('[data-vrule]'), { scaleY: 0, duration: 2, ease: 'atelier', scrollTrigger: st(root.current!, 'top 60%') });
    gsap.from(q('[data-sparkle]'), { scale: 0, rotate: -90, opacity: 0, duration: 1.6, stagger: 0.25, scrollTrigger: st(root.current!, 'top 50%') });

    // Main image: clip reveal, then a slow scale tied to scroll.
    const frame = q('[data-frame]')[0];
    gsap.fromTo(frame, { clipPath: 'inset(18% 12% 18% 12%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 25%', scrub: true },
    });
    gsap.fromTo(q('[data-frame-img]'), { scale: 1.3 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // Small detail image travels faster than the page.
    gsap.fromTo(q('[data-detail]'), { yPercent: 30 }, {
      yPercent: -40, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from(q('[data-principle]'), {
      opacity: 0, y: 30, duration: 1.2, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: st(q('[data-principles]')[0], 'top 85%'),
    });
  }, root);

  return (
    <section ref={root} id="about" className={styles.section} aria-label="About">
      <div className={styles.head}>
        <span className="micro">(02)</span>
        <span className="micro">About — Manifesto</span>
        <span className={styles.headRule} data-rule />
        <span className="micro">Est. {site.founded}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.copy}>
          <Lines
            as="h2"
            label="We create digital art for a new era."
            className={styles.title}
            lines={['We create', <em key="i">digital art</em>, 'for a new era.']}
          />
          <div className={styles.textRow}>
            <span className={styles.vrule} data-vrule aria-hidden="true" />
            <div>
              <p className={styles.lead} data-fade>{site.description}</p>
              <p className={styles.body} data-fade>
                We work with a few clients a year — houses, labels, galleries and founders who prefer depth to noise.
                Each commission is treated as an edition: a single idea, carried with precision from identity to the last frame of motion.
              </p>
              <a
                href="#projects"
                className={styles.more}
                data-fade
                onClick={(e) => { e.preventDefault(); scrollToId('projects'); }}
              >
                <span>Selected work</span>
                <svg viewBox="0 0 36 10" aria-hidden="true"><path d="M0 5h34M30 1l4 4-4 4" fill="none" stroke="currentColor" /></svg>
              </a>
            </div>
          </div>
        </div>

        <figure className={styles.visual}>
          <div className={styles.frame} data-frame>
            <div className={styles.frameImg} data-frame-img>
              <Art name="about" alt="A shrouded figure in warm, low light" sizes="(max-width: 860px) 100vw, 55vw" position="70% 50%" />
            </div>
          </div>
          <figcaption className={styles.caption}>
            <span className="micro">Fig. 02</span>
            <span className="micro">Study in satin, single source</span>
          </figcaption>
          <div className={styles.detail} data-detail>
            <Art name="veil-detail" alt="Detail of satin folds catching light" sizes="(max-width: 860px) 40vw, 16vw" />
          </div>
          <Sparkle className={styles.sparkleA} />
          <Sparkle className={styles.sparkleB} />
        </figure>
      </div>

      <ol className={styles.principles} data-principles>
        {PRINCIPLES.map((p) => (
          <li key={p.n} className={styles.principle} data-principle>
            <span className={styles.pRule} data-rule />
            <span className="micro">{p.n}</span>
            <h3 className={styles.pTitle}>{p.t}</h3>
            <p className={styles.pText}>{p.d}</p>
          </li>
        ))}
      </ol>

      <span className={styles.index} aria-hidden="true">02 / 04</span>
    </section>
  );
}
