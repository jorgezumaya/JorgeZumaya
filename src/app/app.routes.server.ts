import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static pages — prerender at build time (fastest, no Firebase needed)
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'experience', renderMode: RenderMode.Prerender },
  { path: 'work', renderMode: RenderMode.Prerender },
  // Dynamic pages — render on each request (Firebase data required)
  { path: 'gallery', renderMode: RenderMode.Server },
  // Contact is a static form — prerender to avoid SSR/Firestore hydration conflict
  { path: 'contact', renderMode: RenderMode.Prerender },
  // Fallback
  { path: '**', renderMode: RenderMode.Server },
];
