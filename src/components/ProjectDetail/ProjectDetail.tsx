import { useRef, type MouseEvent } from 'react';
import { nextProject, type Project } from '../../data/projects';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useGsap } from '../../lib/useGsap';
import { Art } from '../Art/Art';
import { Chars, Lines } from '../Mask/Mask';
import { Arrow } from '../Projects/Projects';
import { useTransition } from '../Transition/Transition';
import styles from './ProjectDetail.module.css';
import { routeHref } from '../../lib/paths';

export function ProjectDetail({ project: p }: { project: Project }) {
  const root = useRef<HTMLElement>(null);
  const nextMedia = useRef<HTMLDivElement>(null);
  const { go, goSection, onEnter } = useTransition();
  const next = nextProject(p.slug);

  useGsap(() => {
    const q = gsap.utils.selector(root.current);
    if (prefersReducedMotion()) return;

    // Entrance — waits for the page transition to uncover the page.
    gsap.set(q('[data-hero-char]'), { yPercent: 115 });
    gsap.set(q('[data-hero-fade]'), { opacity: 0, y: 16 });
    const enter = gsap.timeline({ paused: true })
      .to(q('[data-hero-char]'), { yPercent: 0, duration: 1.4, stagger: 0.035 }, 0)
      .to(q('[data-hero-fade]'), { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.35)
      .from(q('[data-hero-img]'), { scale: 1.08, duration: 2.4, ease: 'power3.out' }, 0);
    const off = onEnter(() => enter.play());

    gsap.to(q('[data-hero-img]'), {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: q('[data-hero]')[0], start: 'top top', end: 'bottom top', scrub: true },
    });

    q('[data-reveal]').forEach((el) => {
      const from = (sel: string, vars: gsap.TweenVars) => {
        const targets = el.querySelectorAll(sel);
        if (targets.length) gsap.from(targets, { ...vars, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      };
      from('[data-line]', { yPercent: 110, duration: 1.3, stagger: 0.1 });
      from('[data-fade]', { opacity: 0, y: 24, duration: 1.1, stagger: 0.08, delay: 0.2, ease: 'power3.out' });
      from('[data-rule]', { scaleX: 0, duration: 1.6, ease: 'atelier' });
    });

    q('[data-shot]').forEach((shot) => {
      const img = shot.querySelector('[data-shot-img]');
      gsap.fromTo(shot, { clipPath: 'inset(12% 8% 12% 8%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: shot, start: 'top 95%', end: 'top 35%', scrub: true },
      });
      gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    gsap.from(q('[data-swatch]'), { scaleY: 0, transformOrigin: 'bottom', duration: 1.2, stagger: 0.08, ease: 'atelier', scrollTrigger: { trigger: q('[data-palette]')[0], start: 'top 85%', once: true } });

    return () => { off(); enter.kill(); };
  }, root, [p.slug]);

  const back = (e: MouseEvent) => { e.preventDefault(); goSection('projects'); };
  const toNext = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(`/projects/${next.slug}`, { from: nextMedia.current, position: next.heroPosition });
  };

  return (
    <article ref={root} className={styles.page} key={p.slug}>
      <header id="top" className={styles.hero} data-hero>
        <div className={styles.heroMedia}>
          <div className={styles.heroImg} data-hero-img>
            <Art name={p.cover} alt={`${p.title} — key visual`} priority sizes="100vw" position={p.heroPosition} />
          </div>
        </div>
        <a href={routeHref('/', 'projects')} onClick={back} className={styles.back} data-hero-fade>
          <svg viewBox="0 0 36 10" aria-hidden="true"><path d="M36 5H2M6 1L2 5l4 4" fill="none" stroke="currentColor" /></svg>
          <span>All projects</span>
        </a>
        <div className={styles.heroText}>
          <div className={styles.heroMeta}>
            <span className="micro" data-hero-fade>{p.index} / 04</span>
            <span className="micro" data-hero-fade>{p.category}</span>
            <span className="micro" data-hero-fade>{p.year}</span>
          </div>
          <h1 className={styles.heroTitle} aria-label={p.title}>
            {p.title.split(' ').map((w, i) => (
              <span key={i} className={styles.word} aria-hidden="true">
                {[...w].map((ch, j) => <span key={j} className="mask-inline"><span data-hero-char>{ch}</span></span>)}
              </span>
            ))}
          </h1>
          <p className={styles.heroLede} data-hero-fade>{p.lede}</p>
        </div>
      </header>

      <section className={styles.overview} data-reveal aria-label="Overview">
        <dl className={styles.facts}>
          {[
            ['Client', p.client],
            ['Discipline', p.category],
            ['Year', String(p.year)],
            ['Role', p.role.join(', ')],
          ].map(([k, v]) => (
            <div key={k} className={styles.fact} data-fade>
              <span className={styles.factRule} data-rule />
              <dt className="micro">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.story}>
          <div className={styles.block}>
            <span className="micro" data-fade>(i) The task</span>
            <p className={styles.storyText} data-fade>{p.task}</p>
          </div>
          <div className={styles.block}>
            <span className="micro" data-fade>(ii) The concept</span>
            <p className={styles.storyText} data-fade>{p.concept}</p>
          </div>
        </div>
      </section>

      <section className={styles.gallery} aria-label="Gallery">
        {p.gallery.map((g, i) => (
          <figure key={g.art + i} className={`${styles.shotWrap} ${styles['shot' + i]}`}>
            <div className={styles.shot} style={{ aspectRatio: g.ratio }} data-shot>
              <div className={styles.shotImg} data-shot-img>
                <Art name={g.art} alt={g.caption} sizes={i === 0 ? '(max-width: 860px) 100vw, 66vw' : '(max-width: 860px) 100vw, 40vw'} />
              </div>
            </div>
            <figcaption className={styles.shotCap}>
              <span className="micro">Fig. {p.index}.{i + 1}</span>
              <span className="micro">{g.caption}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className={styles.decisions} data-reveal aria-label="Visual decisions">
        <div className={styles.decHead}>
          <span className="micro" data-fade>(iii) Visual decisions</span>
          <Lines as="h2" className={styles.decTitle} label="The system" lines={['The', <em key="s">system</em>]} />
        </div>

        <div className={styles.palette} data-palette>
          {p.palette.map((c) => (
            <div key={c.hex} className={styles.swatch}>
              <span className={styles.chip} style={{ background: c.hex }} data-swatch />
              <span className="micro">{c.name}</span>
              <span className="micro">{c.hex}</span>
            </div>
          ))}
        </div>

        <div className={styles.specimen} data-fade>
          <span className={styles.specimenBig} aria-hidden="true">Aa</span>
          <div className={styles.specimenMeta}>
            <p className="micro">Display — Cormorant Garamond 300</p>
            <p className={styles.specimenLine}>Light is the only colour.</p>
            <p className="micro">Interface — Inter · Captions — JetBrains Mono</p>
          </div>
        </div>

        <ol className={styles.decList}>
          {p.decisions.map((d, i) => (
            <li key={d.title} className={styles.dec} data-fade>
              <span className={styles.factRule} data-rule />
              <span className="micro">0{i + 1}</span>
              <h3 className={styles.decName}>{d.title}</h3>
              <p className={styles.decText}>{d.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.quote} data-reveal aria-label="Quote">
        <Lines as="blockquote" className={styles.quoteText} label={p.quote} lines={[`“${p.quote}”`]} />
        <span className="micro" data-fade>— NOCTURNE, project notes</span>
      </section>

      <nav className={styles.next} aria-label="Next project">
        <a href={routeHref(`/projects/${next.slug}`)} onClick={toNext} className={styles.nextLink} data-cursor="view" data-cursor-label="Next project">
          <div className={styles.nextHead}>
            <span className="micro">Next project — {next.index}</span>
            <span className="micro">{next.category}</span>
          </div>
          <div className={styles.nextTitle}>
            <Chars text={next.title} />
            <Arrow className={styles.nextArrow} />
          </div>
          <div ref={nextMedia} className={styles.nextMedia}>
            <Art name={next.cover} alt="" sizes="100vw" />
          </div>
        </a>
      </nav>
    </article>
  );
}
