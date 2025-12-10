import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CitizenPortalComponent } from './pages/citizen-portal/citizen-portal.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    // ⬇ IMPORTANT: register standalone component
    CitizenPortalComponent
  ],
};
