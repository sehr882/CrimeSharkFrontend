import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CitizenPortalComponent } from './pages/citizen-portal/citizen-portal.component';
import { AuthorityPortalComponent } from './pages/authority-portal/authority-portal.component';


export const routes: Routes = [
  // Home Screen
  { path: '', component: HomeComponent },

  // Citizen Portal
  { path: 'citizen', component: CitizenPortalComponent },
  {
  path: 'authority-portal',
  component: AuthorityPortalComponent
},


  // Live Map
  {
    path: 'live-map',
    loadComponent: () =>
      import('./pages/live-map/live-map.component')
        .then(m => m.LiveMapComponent)
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then(m => m.AuthComponent),
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

  {
  path: 'authority/portal',
  loadComponent: () =>
    import('./pages/authority-portal/authority-portal.component')
      .then(m => m.AuthorityPortalComponent)
},

{
    path: 'safety-tips',
    loadComponent: () =>
      import('./pages/safety-tips/safety-tips.component')
         .then(m => m.SafetyTipsComponent),
  }
 
];



