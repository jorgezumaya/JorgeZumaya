import { RenderMode, ServerRoute } from '@angular/ssr';
import { ROUTE_PATHS } from './app.route-paths';

export const serverRoutes: ServerRoute[] = [
  // Static pages — prerender at build time (fastest, no Firebase needed)
  { path: ROUTE_PATHS.home, renderMode: RenderMode.Prerender },
  { path: ROUTE_PATHS.experience, renderMode: RenderMode.Prerender },
  { path: ROUTE_PATHS.work, renderMode: RenderMode.Prerender },
  // Gallery needs live Firebase data, but Firebase Hosting only serves the
  // static browser build here — there is no deployed SSR server to render
  // this per request. Render fully client-side instead of a mismatched shell.
  { path: ROUTE_PATHS.gallery, renderMode: RenderMode.Client },
  // Contact is a static form — prerender to avoid SSR/Firestore hydration conflict
  { path: ROUTE_PATHS.contact, renderMode: RenderMode.Prerender },
  // Prospects is a static bilingual landing page shared as a direct link — prerender.
  { path: ROUTE_PATHS.prospects, renderMode: RenderMode.Prerender },
  // Resume needs a live Storage download URL at request time, same as gallery —
  // render fully client-side rather than a mismatched prerendered shell.
  { path: ROUTE_PATHS.resume, renderMode: RenderMode.Client },
  // Fallback — no SSR server is deployed, so client-render rather than
  // falling back to a mismatched static shell.
  { path: '**', renderMode: RenderMode.Client },
];
