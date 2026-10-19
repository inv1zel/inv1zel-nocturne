/**
 * Site-wide settings. NOCTURNE is a fictional studio: this site is a concept portfolio piece
 * and deliberately collects no contact details or personal data.
 */
export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  founded: number;
  /** One-line disclaimer repeated in the menu and footer. */
  disclaimer: string;
}

export const site: SiteConfig = {
  name: 'NOCTURNE',
  tagline: 'Digital Atelier',
  description:
    'NOCTURNE is an independent digital atelier exploring the intersection of design, technology and visual culture.',
  founded: 2019,
  disclaimer: 'Concept portfolio project. The studio, clients and projects are fictional.',
};
