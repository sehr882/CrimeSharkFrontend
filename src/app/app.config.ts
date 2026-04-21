import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CitizenPortalComponent } from './pages/citizen/citizen-portal/citizen-portal.component';
import { provideHttpClient, withInterceptorsFromDi, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter, withRouterConfig } from '@angular/router';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
<<<<<<< HEAD
      routes),
=======
      routes,

    ),
>>>>>>> 8f8827280d621d8f87197b839db84389ba3b7c1e
    provideAnimations(),

    provideHttpClient(withInterceptorsFromDi()),

    CitizenPortalComponent
  ],
};