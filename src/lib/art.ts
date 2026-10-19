import manifest from '../data/art-manifest.json';
import { publicUrl } from './paths';

export type ArtName =
  | 'hero' | 'about' | 'veil-detail' | 'veil-dark'
  | 'muse-marble' | 'muse-fracture'
  | 'monolith' | 'monolith-wide'
  | 'chrome' | 'chrome-helmet' | 'chrome-close'
  | 'bloom' | 'corridor' | 'corridor-empty';

export interface ArtEntry { width: number; height: number; widths: number[]; placeholder: string }

const data = manifest as Record<string, ArtEntry>;

export function getArt(name: ArtName): ArtEntry {
  const entry = data[name];
  if (!entry) throw new Error(`Missing art "${name}". Run \`npm run art:optimize\`.`);
  return entry;
}

export const artSrcSet = (name: ArtName, ext: 'avif' | 'webp') =>
  getArt(name).widths.map((w) => `${publicUrl('art')}/${name}-${w}.${ext} ${w}w`).join(', ');

export const artSrc = (name: ArtName, width = 1600) => {
  const { widths } = getArt(name);
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `${publicUrl('art')}/${name}-${w}.webp`;
};
