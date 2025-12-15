import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AuthorityPortalComponent } from './pages/authority-portal/authority-portal.component';
import { CitizenLayoutComponent } from './layout/citizen-layout/citizen-layout.component';

// Citizen dashboard
import { CitizenPortalComponent } from './pages/citizen/citizen-portal/citizen-portal.component';


export const routes: Routes = [

  // HOME
  { path: '', component: HomeComponent },

  // CITIZEN AREA (STATIC NAVBAR)
  // ----------------------------------
  // CITIZEN AREA (STATIC NAVBAR)
  // ----------------------------------
  {
    path: 'citizen',
    component: CitizenLayoutComponent,
    children: [

      // DASHBOARD
      {
        path: '',
        component: CitizenPortalComponent
      },

      // LIVE MAP
      {
        path: 'live-map',
        loadComponent: () =>
          import('./pages/citizen/live-map/live-map.component')
            .then(m => m.LiveMapComponent)
      },

      // SAFETY TIPS
      {
        path: 'safety-tips',
        loadComponent: () =>
          import('./pages/citizen/safety-tips/safety-tips.component')
            .then(m => m.SafetyTipsComponent)
      },

      // ----------------------------------
  // AUTH
  // ----------------------------------
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/citizen/auth/auth.component')
        .then(m => m.AuthComponent)
  },

    ]
  },

  // ----------------------------------
  // REPORT CRIME
  // ----------------------------------
  {
    path: 'report',
    loadComponent: () =>
      import('./pages/citizen/report-crime/report-crime.component')
        .then(m => m.ReportCrimeComponent)
  },

  {
    path: 'authority/login',
    loadComponent: () =>
      import('./pages/authority-login/authority-login.component')
        .then(m => m.AuthorityLoginComponent)
  },

  // AUTHORITY
  { path: 'authority/portal', component: AuthorityPortalComponent },


];





