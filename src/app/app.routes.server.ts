import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static pages — prerender at build time (fastest, no Firebase needed)
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'experience', renderMode: RenderMode.Prerender },
  { path: 'work', renderMode: RenderMode.Prerender },
  // Dynamic pages — render on each request (Firebase data required)
  { path: 'gallery', renderMode: RenderMode.Server },
  { path: 'contact', renderMode: RenderMode.Server },
  // Fallback
  { path: '**', renderMode: RenderMode.Server },
];
