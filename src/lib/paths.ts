/**
 * Hash routing is for static hosts without an SPA fallback (build with `npm run build:static`).
 * Everything else uses clean URLs.
 */
export const HASH_ROUTING = import.meta.env.VITE_HASH_ROUTER === '1';

/** href for an in-app route, optionally pointing at a section of the home page. */
export const routeHref = (path: string, section?: string) =>
  HASH_ROUTING ? `#${path}` : section ? `${path}#${section}` : path;

/** URL of a file in /public, respecting the configured base. */
export const publicUrl = (file: string) => `${import.meta.env.BASE_URL}${file}`;
