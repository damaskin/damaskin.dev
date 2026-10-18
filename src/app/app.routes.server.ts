import { RenderMode, ServerRoute } from '@angular/ssr';

/** Both language versions are prerendered to static HTML at build time (outputMode: static). */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'en', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
