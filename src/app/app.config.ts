import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CitizenPortalComponent } from './pages/citizen/citizen-portal/citizen-portal.component';
import { provideHttpClient, withInterceptorsFromDi, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter, withRouterConfig } from '@angular/router';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,

    ),
    provideAnimations(),

    provideHttpClient(withInterceptorsFromDi()),

    CitizenPortalComponent
  ],
};