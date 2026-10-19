import type { ArtName } from '../lib/art';

export interface Project {
  slug: string;
  index: string;
  title: string;
  category: string;
  year: number;
  client: string;
  role: string[];
  cover: ArtName;
  /** object-position of the cover when it fills the screen on the project page. */
  heroPosition: string;
  /** Aspect ratio of the cover in the home grid (CSS aspect-ratio). */
  gridRatio: string;
  lede: string;
  task: string;
  concept: string;
  gallery: { art: ArtName; caption: string; ratio: string }[];
  palette: { name: string; hex: string }[];
  decisions: { title: string; text: string }[];
  quote: string;
}

export const projects: Project[] = [
  {
    slug: 'visual-identity',
    index: '01',
    title: 'Sleeping Muse',
    category: 'Visual Identity',
    year: 2026,
    client: 'Maison Halden (fictional)',
    role: ['Identity system', 'Typography', 'Art direction'],
    cover: 'muse-marble',
    heroPosition: '50% 48%',
    gridRatio: '4 / 5',
    lede: 'An identity for a private collection of modernist sculpture, built around the stillness of a face at rest.',
    task:
      'The collection had outgrown its catalogue. It needed a voice that could sit next to marble without imitating it — quiet enough for a gallery wall, distinct enough for a single initial embossed on paper.',
    concept:
      'We drew the identity from the sculptures themselves: the ovoid, the closed eye, the raking light that reveals a surface only at its edge. The logotype is cut from a high-contrast serif whose hairlines disappear in low light, so the mark changes character with the room it is shown in.',
    gallery: [
      { art: 'muse-fracture', caption: 'Surface study — fracture as a grid system', ratio: '4 / 5' },
      { art: 'veil-detail', caption: 'Light as the only colour', ratio: '3 / 4' },
    ],
    palette: [
      { name: 'Void', hex: '#080808' },
      { name: 'Basalt', hex: '#1A1A1A' },
      { name: 'Plaster', hex: '#BDB8B0' },
      { name: 'Marble', hex: '#E8E5E0' },
    ],
    decisions: [
      { title: 'Raking light', text: 'Every photograph is lit from a single low source. The grid follows the shadow line.' },
      { title: 'Closed forms', text: 'The ovoid becomes a container for type, seals and the digital avatar.' },
      { title: 'Hairline type', text: 'A display serif at 300 weight, never set below 48px, never in bold.' },
    ],
    quote: 'A face at rest says more than a face that speaks.',
  },
  {
    slug: 'branding',
    index: '02',
    title: 'Monolith',
    category: 'Branding',
    year: 2025,
    client: 'Still Water Hotels (fictional)',
    role: ['Brand strategy', 'Naming', 'Photography direction'],
    cover: 'monolith',
    heroPosition: '50% 72%',
    gridRatio: '3 / 4',
    lede: 'A brand for a hotel built on the edge of a mountain lake, where the architecture is meant to disappear into fog.',
    task:
      'Hospitality brands compete with brightness. The brief asked for the opposite: a brand that lowers the volume, that a guest notices only when they stop moving.',
    concept:
      'One vertical. A single upright line — the monolith — stands for the building, the horizon and the guest. It appears as a ribbon on keycards, a slit in signage, a pause in the website’s rhythm. Everything else is water, mist and grey.',
    gallery: [
      { art: 'monolith-wide', caption: 'Establishing frame — the horizon as a typographic baseline', ratio: '12 / 7' },
      { art: 'corridor-empty', caption: 'Interior language — colonnade and fog', ratio: '4 / 5' },
    ],
    palette: [
      { name: 'Lake', hex: '#0B0B0C' },
      { name: 'Mist', hex: '#5A5A5A' },
      { name: 'Fog', hex: '#8A8A8A' },
      { name: 'Paper', hex: '#DCD9D3' },
    ],
    decisions: [
      { title: 'One vertical', text: 'A single upright stroke recurs at every scale, from favicon to façade.' },
      { title: 'Grey as luxury', text: 'Seven greys, no accent colour. Warmth comes from paper stock, not ink.' },
      { title: 'Slow cadence', text: 'Layouts leave a third of every page empty — the lake in the frame.' },
    ],
    quote: 'Stillness is the most expensive thing we can offer.',
  },
  {
    slug: '3d-motion',
    index: '03',
    title: 'Liquid Chrome',
    category: '3D & Motion',
    year: 2025,
    client: 'Halcyon Audio (fictional)',
    role: ['3D direction', 'Motion system', 'Launch film'],
    cover: 'chrome',
    heroPosition: '50% 45%',
    gridRatio: '16 / 11',
    lede: 'A launch world for a pair of headphones that were never shown — only the sound of them, cast in black chrome.',
    task:
      'The product was still under embargo. The campaign had to build desire for an object nobody could see, and survive as a motion system for two years of releases.',
    concept:
      'We turned frequency into form. A torus that twists with the bass line, a droplet that lags behind the beat. Rendered as black chrome, the objects reflect only the studio lights — the brand is literally made of what surrounds it.',
    gallery: [
      { art: 'chrome-helmet', caption: 'Frame 0412 — the bloom state', ratio: '8 / 5' },
      { art: 'chrome-close', caption: 'Reflection studies — strip light only', ratio: '4 / 5' },
    ],
    palette: [
      { name: 'Black chrome', hex: '#050505' },
      { name: 'Graphite', hex: '#2A2A2A' },
      { name: 'Strip light', hex: '#F2F0EC' },
      { name: 'Halo', hex: '#9A9A9A' },
    ],
    decisions: [
      { title: 'Reflection only', text: 'No textures, no colour: the material reveals itself through mirrored light.' },
      { title: 'Easing as identity', text: 'A single custom curve (0.76, 0, 0.24, 1) drives every transition.' },
      { title: 'Loop-ready', text: 'Each scene resolves to its first frame, so any clip can loop on a screen.' },
    ],
    quote: 'We designed the reflection, not the object.',
  },
  {
    slug: 'art-direction',
    index: '04',
    title: 'Night Garden',
    category: 'Art Direction',
    year: 2024,
    client: 'Atelier Verre (fictional)',
    role: ['Art direction', 'Set design', 'Editorial'],
    cover: 'bloom',
    heroPosition: '50% 50%',
    gridRatio: '4 / 5',
    lede: 'An editorial series for a fragrance house: flowers cast in metal, draped figures, and a garden that only exists after dark.',
    task:
      'The house wanted a seasonal campaign that would not look seasonal. No petals in sunlight, no pastel — something that could hang in the boutique for years.',
    concept:
      'We cast the botanical in black metal and dressed the human in wet satin, then lit both with the same single source. Flower and figure become one material: dark, reflective, slightly unreal.',
    gallery: [
      { art: 'veil-dark', caption: 'Figure study — satin under one light', ratio: '4 / 5' },
      { art: 'veil-detail', caption: 'Fold detail', ratio: '3 / 4' },
    ],
    palette: [
      { name: 'Night', hex: '#070707' },
      { name: 'Iron', hex: '#202020' },
      { name: 'Satin', hex: '#6E6E6E' },
      { name: 'Moon', hex: '#E8E5E0' },
    ],
    decisions: [
      { title: 'One light', text: 'Every frame in the series shares a single key light angle: 35° from the upper left.' },
      { title: 'Material rhyme', text: 'Metal petals and satin folds are composed to echo each other across spreads.' },
      { title: 'Editorial pacing', text: 'Full-bleed image, then silence, then a single line of copy.' },
    ],
    quote: 'Every garden has a night shift.',
  },
];

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
