import { useRef, type MouseEvent } from 'react';
import { projects, type Project } from '../../data/projects';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useGsap } from '../../lib/useGsap';
import { Art } from '../Art/Art';
import { Lines } from '../Mask/Mask';
import { useTransition } from '../Transition/Transition';
import styles from './Projects.module.css';
import { routeHref } from '../../lib/paths';

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" aria-hidden="true">
      <path d="M1 13L13 1M4 1h9v9" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function ProjectCard({ p, layout }: { p: Project; layout: string }) {
  const { go } = useTransition();
  const media = useRef<HTMLDivElement>(null);
  const open = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // allow "open in new tab"
    e.preventDefault();
    go(`/projects/${p.slug}`, { from: media.current, position: p.heroPosition });
  };
  return (
    <article className={`${styles.card} ${styles[layout]}`} data-card>
      <a href={routeHref(`/projects/${p.slug}`)} onClick={open} className={styles.link} data-cursor="view" data-cursor-label="View project">
        <div ref={media} className={styles.media} style={{ aspectRatio: p.gridRatio }} data-card-media>
          <div className={styles.mediaInner} data-card-img>
            <Art name={p.cover} alt={`${p.title} — ${p.category}`} sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>
        <div className={styles.caption} data-card-cap>
          <span className={styles.num}>{p.index}</span>
          <div className={styles.names}>
            <span className={styles.category}>{p.category}</span>
            <h3 className={styles.title}>{p.title}</h3>
          </div>
          <span className={styles.year}>{p.year}</span>
          <Arrow className={styles.arrow} />
        </div>
      </a>
    </article>
  );
}

const LAYOUTS = ['a', 'b', 'c', 'd'];

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    gsap.from(q('[data-line]'), { yPercent: 110, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: q('h2')[0], start: 'top 85%', once: true } });
    gsap.from(q('[data-rule]'), { scaleX: 0, duration: 1.8, ease: 'atelier', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });

    q('[data-card]').forEach((card) => {
      const m = card.querySelector('[data-card-media]');
      const img = card.querySelector('[data-card-img]');
      const cap = card.querySelector('[data-card-cap]');
      gsap.fromTo(m, { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'atelier',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      });
      gsap.fromTo(img, { yPercent: -8, scale: 1.18 }, {
        yPercent: 8, scale: 1.04, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      gsap.from(cap, { opacity: 0, y: 20, duration: 1, delay: 0.5, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
    });
  }, root);

  return (
    <section ref={root} id="projects" className={styles.section} aria-label="Selected projects">
      <div className={styles.head}>
        <span className="micro">(03)</span>
        <span className="micro">Selected projects</span>
        <span className={styles.headRule} data-rule />
        <span className="micro">2024 — 2026</span>
      </div>

      <div className={styles.intro}>
        <Lines as="h2" className={styles.heading} label="Selected work" lines={['Selected', <em key="w">work</em>]} />
        <p className={styles.note}>
          Four commissions, four disciplines. Each one an edition of a single idea — open a project to see the full story.
        </p>
      </div>

      <div className={styles.grid}>
        {projects.map((p, i) => <ProjectCard key={p.slug} p={p} layout={LAYOUTS[i % LAYOUTS.length]} />)}
      </div>

      <span className={styles.index} aria-hidden="true">03 / 04</span>
    </section>
  );
}
