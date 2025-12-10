import { Routes } from '@angular/router';
import { CitizenPortalComponent } from './pages/citizen-portal/citizen-portal.component';

export const routes: Routes = [
  { path: '', component: CitizenPortalComponent },
  {
    path: 'live-map',
    loadComponent: () =>
      import('./pages/live-map/live-map.component')
        .then(m => m.LiveMapComponent)
  },
 {
  path: 'report',
  loadComponent: () =>
    import('./pages/report-crime/report-crime.component')
      .then(m => m.ReportCrimeComponent)
}
];


