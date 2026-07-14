// Single source of truth for route path segments, shared between app.routes.ts
// (client router) and app.routes.server.ts (SSR render-mode config) so the two
// tables can't silently drift.
export const ROUTE_PATHS = {
  home: '',
  experience: 'experience',
  work: 'work',
  gallery: 'gallery',
  contact: 'contact',
  prospects: 'prospects',
} as const;
