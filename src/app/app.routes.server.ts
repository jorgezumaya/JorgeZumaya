import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static pages — prerender at build time (fastest, no Firebase needed)
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'experience', renderMode: RenderMode.Prerender },
  { path: 'work', renderMode: RenderMode.Prerender },
  // Gallery needs live Firebase data, but Firebase Hosting only serves the
  // static browser build here — there is no deployed SSR server to render
  // this per request. Render fully client-side instead of a mismatched shell.
  { path: 'gallery', renderMode: RenderMode.Client },
  // Contact is a static form — prerender to avoid SSR/Firestore hydration conflict
  { path: 'contact', renderMode: RenderMode.Prerender },
  // Prospects is a static bilingual landing page shared as a direct link — prerender.
  { path: 'prospects', renderMode: RenderMode.Prerender },
  // Fallback — no SSR server is deployed, so client-render rather than
  // falling back to a mismatched static shell.
  { path: '**', renderMode: RenderMode.Client },
];
