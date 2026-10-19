// Every image used by the site. Names map to src/assets/art/<name>.{avif,webp}
const warm = [1, 0.95, 0.88];
export const jobs = [
  { name: 'hero', scene: 'veil', w: 2400, h: 1400, ro: [-0.9, 0.75, 4.1], ta: [-0.6, 1.0, 0], fov: 1.9, seed: 2, tint: [1, 0.98, 0.95] },
  { name: 'veil-detail', scene: 'veil', w: 1200, h: 1600, ro: [0.9, 1.5, 1.6], ta: [0.0, 1.35, 0], fov: 1.7, seed: 7, v: 1 },
  { name: 'veil-dark', scene: 'veil', w: 1600, h: 2000, ro: [1.6, 0.9, 3.6], ta: [0.0, 0.95, 0], fov: 1.9, seed: 11, v: 2, exp: 0.9 },
  { name: 'about', scene: 'veil', w: 2400, h: 1500, ro: [2.2, 1.25, 2.6], ta: [-0.9, 1.2, 0], fov: 1.8, seed: 5, v: 3, tint: warm, exp: 1.1 },
  { name: 'muse-marble', scene: 'muse', w: 1600, h: 2000, ro: [0.5, 1.3, 2.9], ta: [0.0, 0.3, 0], fov: 2.2, v: 0, seed: 3 },
  { name: 'muse-fracture', scene: 'muse', w: 1600, h: 2000, ro: [-0.6, 0.9, 2.0], ta: [0.0, 0.32, 0], fov: 2.4, v: 2, seed: 8 },
  { name: 'monolith', scene: 'monolith', w: 1600, h: 2000, ro: [0.6, 0.55, 2.0], ta: [0.0, 2.2, -9], fov: 1.9, seed: 4, exp: 0.85 },
  { name: 'monolith-wide', scene: 'monolith', w: 2400, h: 1400, ro: [-2.5, 1.2, 4.0], ta: [0.0, 1.6, -9], fov: 2.1, seed: 9, exp: 0.8 },
  { name: 'chrome', scene: 'chrome', w: 1600, h: 2000, ro: [0.4, 2.2, 5.0], ta: [0, 0.95, 0], fov: 2.0, v: 0, seed: 1 },
  { name: 'chrome-helmet', scene: 'chrome', w: 2400, h: 1500, ro: [-2.6, 1.5, 4.2], ta: [0, 1.0, 0], fov: 2.2, v: 1, seed: 2 },
  { name: 'chrome-close', scene: 'chrome', w: 1600, h: 2000, ro: [1.2, 1.4, 2.2], ta: [0.2, 1.0, 0], fov: 2.0, v: 0, seed: 3 },
  { name: 'bloom', scene: 'bloom', w: 1600, h: 2000, ro: [0.0, 3.3, 2.4], ta: [0, 0.15, 0], fov: 2.0, v: 0, seed: 5 },
  { name: 'corridor', scene: 'corridor', w: 2400, h: 1400, ro: [0.6, 1.7, 6.0], ta: [0.0, 1.8, -10], fov: 1.6, v: 1, seed: 6 },
  { name: 'corridor-empty', scene: 'corridor', w: 1600, h: 2000, ro: [-1.2, 1.2, 3.0], ta: [0.4, 2.2, -10], fov: 1.5, v: 0, seed: 10 },
];
