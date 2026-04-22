import { ApplicationConfig } from '@angular/core';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CitizenPortalComponent } from './pages/citizen/citizen-portal/citizen-portal.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    // Attach JWT to every outgoing request automatically
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CitizenPortalComponent,
  ],
};
