import { useRef } from 'react';
import { Art } from '../Art/Art';
import { Chars } from '../Mask/Mask';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useGsap } from '../../lib/useGsap';
import { scrollToId, useTransition } from '../Transition/Transition';
import styles from './Hero.module.css';

/** The full intro plays once per visit; later visits to the home page get the short version. */
let introPlayed = false;

function waitForImage(root: HTMLElement, timeout = 2500) {
  const img = root.querySelector('img');
  if (!img || img.complete) return Promise.resolve();
  return new Promise<void>((res) => {
    const done = () => res();
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
    setTimeout(done, timeout);
  });
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { onEnter } = useTransition();

  useGsap(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const chars = q('[data-title] [data-char]');
    const header = document.querySelectorAll('[data-intro="header"]');
    const fades = [...q('[data-intro="fade"]'), ...header];

    if (prefersReducedMotion()) {
      gsap.set(q('[data-overlay]'), { display: 'none' });
      introPlayed = true;
      return;
    }

    // Initial state, applied before first paint.
    gsap.set(chars, { yPercent: 115 });
    gsap.set(q('[data-title]'), { letterSpacing: '0.06em' });
    gsap.set(q('[data-dark]'), { opacity: 1 });
    gsap.set(q('[data-media]'), { scale: 1.16 });
    gsap.set(fades, { opacity: 0, y: 14 });
    gsap.set(q('[data-sub] [data-char]'), { opacity: 0 });

    const main = gsap.timeline({ paused: true, defaults: { ease: 'reveal' } })
      .to(q('[data-dark]'), { opacity: 0, duration: 2.6, ease: 'power2.inOut' }, 0)
      .to(q('[data-media]'), { scale: 1, duration: 3.2, ease: 'power3.out' }, 0)
      .to(chars, { yPercent: 0, duration: 1.6, stagger: { each: 0.07, from: 'center' } }, 0.25)
      .to(q('[data-title]'), { letterSpacing: '-0.01em', duration: 2.4, ease: 'power3.out' }, 0.25)
      .to(q('[data-sub] [data-char]'), { opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power1.out' }, 1.1)
      .to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.06, ease: 'power3.out' }, 1.3)
      .from(q('[data-rule]'), { scaleX: 0, duration: 1.6, ease: 'atelier' }, 1.4);

    let intro: gsap.core.Timeline | undefined;
    let off = () => {};
    if (!introPlayed) {
      introPlayed = true;
      const ov = q('[data-overlay]')[0];
      const counter = q('[data-count]')[0];
      const count = { v: 0 };
      intro = gsap.timeline({ defaults: { ease: 'atelier' } })
        .fromTo(q('[data-logo] [data-char]'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.05, ease: 'reveal' }, 0.2)
        .fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0.3)
        .to(count, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => { counter.textContent = String(Math.round(count.v)).padStart(3, '0'); } }, 0.3)
        .addPause('+=0', () => { waitForImage(el).then(() => intro?.play()); })
        .to(q('[data-logo] [data-char]'), { yPercent: -110, duration: 0.7, stagger: 0.03, ease: 'power3.in' }, '+=0.05')
        .to(q('[data-overlay-meta]'), { opacity: 0, duration: 0.4 }, '<')
        .to(ov, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2 }, '-=0.15')
        .add(() => { main.play(); }, '-=0.55')
        .set(ov, { display: 'none' });
    } else {
      gsap.set(q('[data-overlay]'), { display: 'none' });
      off = onEnter(() => main.play());
    }

    // Scroll: image drifts down, title lifts and fades — the scene recedes as the page begins.
    const scroll = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      defaults: { ease: 'none' },
    })
      .to(q('[data-parallax]'), { yPercent: 18 }, 0)
      .to(q('[data-title-wrap]'), { yPercent: -40, opacity: 0.15 }, 0)
      .to(q('[data-shade]'), { opacity: 1 }, 0);

    return () => { intro?.kill(); main.kill(); scroll.kill(); off(); };
  }, root);

  return (
    <section ref={root} id="top" className={styles.hero} aria-label="Intro">
      <div className={styles.media} data-parallax>
        <div className={styles.mediaInner} data-media>
          <Art name="hero" alt="A veiled sculpture in black satin, lit by a single hard light" priority position="62% 40%" />
        </div>
        <div className={styles.dark} data-dark />
        <div className={styles.shade} data-shade />
      </div>

      <div className={styles.sideLeft} data-intro="fade">
        <span className="micro">Art</span>
        <span className="micro">Technology</span>
        <span className="micro">Time</span>
      </div>
      <div className={styles.sideRight} data-intro="fade">
        <span className="micro">N°&nbsp;01</span>
        <span className="micro">Independent</span>
        <span className="micro">Digital</span>
        <span className="micro">Atelier</span>
      </div>

      <div className={styles.titleWrap} data-title-wrap>
        <h1 className={styles.title} data-title>
          <Chars text="NOCTURNE" />
        </h1>
        <p className={styles.subtitle} data-sub>
          <Chars text="DIGITAL ATELIER" />
        </p>
      </div>

      <div className={styles.bottom}>
        <a
          href="#about"
          className={styles.scroll}
          data-intro="fade"
          onClick={(e) => { e.preventDefault(); scrollToId('about'); }}
        >
          <span className="micro">Scroll</span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </a>
        <span className={styles.rule} data-rule aria-hidden="true" />
        <span className="micro" data-intro="fade">01 / 04</span>
      </div>

      <div className={styles.overlay} data-overlay aria-hidden="true">
        <div className={styles.overlayLogo} data-logo><Chars text="NOCTURNE" /></div>
        <div className={styles.overlayMeta} data-overlay-meta>
          <span className="micro">Digital atelier</span>
          <span className={styles.progress}><span data-progress /></span>
          <span className="micro" data-count>000</span>
        </div>
      </div>
    </section>
  );
}
