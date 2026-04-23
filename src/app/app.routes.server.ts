import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'authority/**',
    renderMode: RenderMode.Client
  },
  {
    // Citizen routes use localStorage/Google Maps — must run in browser
    path: 'citizen/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
