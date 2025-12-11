import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CitizenPortalComponent } from './pages/citizen-portal/citizen-portal.component';

export const routes: Routes = [
  // Home Screen
  { path: '', component: HomeComponent },

  // Citizen Portal
  { path: 'citizen', component: CitizenPortalComponent },

  // Live Map
  {
    path: 'live-map',
    loadComponent: () =>
      import('./pages/live-map/live-map.component')
        .then(m => m.LiveMapComponent)
  },

  // Report Crime
  {
  path: 'report',
  loadComponent: () =>
    import('./pages/report-crime/report-crime.component').then(
      (m) => m.ReportCrimeComponent
    ),
},



  // Authority Login
  {
    path: 'authority/login',
    loadComponent: () =>
      import('./pages/authority-login/authority-login.component')
        .then(m => m.AuthorityLoginComponent)
  },

  // Default unknown route → redirect to home
  { path: '**', redirectTo: '' }
];



