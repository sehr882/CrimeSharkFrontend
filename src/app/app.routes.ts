import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CitizenLayoutComponent } from './layout/citizen-layout/citizen-layout.component';
import { CitizenPortalComponent } from './pages/citizen/citizen-portal/citizen-portal.component';
import { AuthorityLayoutComponent } from './layout/authority-layout/authority-layout.component';
import { provideRouter, withRouterConfig } from '@angular/router';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  {
    path: 'citizen',
    component: CitizenLayoutComponent,
    children: [

      { path: '', component: CitizenPortalComponent },

      {
        path: 'live-map',
        loadComponent: () =>
          import('./pages/citizen/live-map/live-map.component')
            .then(m => m.LiveMapComponent)
      },

      {
        path: 'safety-tips',
        loadComponent: () =>
          import('./pages/citizen/safety-tips/safety-tips.component')
            .then(m => m.SafetyTipsComponent)
      },

      {
        path: 'auth',
        loadComponent: () =>
          import('./pages/citizen/auth/auth.component')
            .then(m => m.AuthComponent)
      },
      {
        path: 'report',
        loadComponent: () =>
          import('./pages/citizen/report-crime/report-crime.component')
            .then(m => m.ReportCrimeComponent)
      },

      {
        path: 'my-reports',
        loadComponent: () =>
          import('./pages/citizen/my-reports/my-reports.component')
            .then(m => m.MyReportsComponent)
      }
    ]
  },

  {
    path: 'authority/login',
    loadComponent: () =>
      import('./pages/authority-login/authority-login.component')
        .then(m => m.AuthorityLoginComponent)
  },
  {
    path: 'authority',
    component: AuthorityLayoutComponent,
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./pages/authority/authority-portal/authority-portal.component')
            .then(m => m.AuthorityPortalComponent)
      },

      {
        path: 'reports',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/authority/reports/reports.component')
            .then(m => m.ReportsComponent)
      },

      {
        path: 'reports/:id',
        loadComponent: () =>
          import('./pages/authority/reports/report-details/report-details.component')
            .then(m => m.ReportDetailsComponent)
      },

      {
        path: 'case-assignment',
        loadComponent: () =>
          import('./pages/authority/case-assignment/case-assignment.component')
            .then(m => m.CaseAssignmentComponent)
      },
      {
        path: 'officers',
        loadComponent: () =>
          import('./pages/authority/authority-officer/authority-officer.component')
            .then(m => m.AuthorityOfficerComponent)
      },
      {
        path: 'add-officer',
        loadComponent: () =>
          import('./pages/authority/add-officer/add-officer.component')
            .then(m => m.AuthorityAddOfficerComponent)
      },
      {
        path: 'add-officer/:id',
        loadComponent: () =>
          import('./pages/authority/add-officer/add-officer.component')
            .then(m => m.AuthorityAddOfficerComponent)
      }

    ]
  },
 {
  path: 'officer',
  component: AuthorityLayoutComponent,
  children: [

    {
      path: '',
      loadComponent: () =>
        import('./pages/authority/authority-portal/authority-portal.component')
          .then(m => m.AuthorityPortalComponent)
    },

    {
      path: 'reports',
      loadComponent: () =>
        import('./pages/authority/reports/reports.component')
          .then(m => m.ReportsComponent)
    },

    {
      path: 'profile',
      loadComponent: () =>
        import('./pages/authority/authority-officer/authority-officer.component')
          .then(m => m.AuthorityOfficerComponent)
    },

    {
      path: 'cases',
      loadComponent: () =>
        import('./pages/authority/case-assignment/case-assignment.component')
          .then(m => m.CaseAssignmentComponent)
    }

  ]
}
];