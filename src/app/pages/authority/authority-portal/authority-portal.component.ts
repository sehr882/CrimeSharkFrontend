import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service';

@Component({
  selector: 'app-authority-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './authority-portal.component.html',
  styleUrls: ['./authority-portal.component.scss']
})
export class AuthorityPortalComponent implements OnInit, OnDestroy {

  totalReports = 0;
  pendingReports = 0;
  resolvedReports = 0;

  recentReports: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private crimeService: CrimeService,
    private cdr: ChangeDetectorRef
<<<<<<< HEAD
  ) { }

  ngOnInit(): void {

    this.loadDashboardData();


=======
  ) {}

  ngOnInit(): void {
    // Initial load every time this component mounts
    this.loadDashboardData();

    // Re-fetch when a status update is confirmed on the detail page.
    // Because statusUpdated$ is now a ReplaySubject(1), this also fires
    // immediately if an update happened BEFORE this component mounted —
    // covering the case where the portal was not alive during the PATCH.
>>>>>>> 8f8827280d621d8f87197b839db84389ba3b7c1e
    this.crimeService.statusUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadDashboardData());

<<<<<<< HEAD

=======
    // Belt-and-suspenders: re-fetch on every NavigationEnd that lands on
    // this route. Covers edge cases where Angular reuses the component
    // instance without re-running ngOnInit (route-reuse-strategy scenarios).
>>>>>>> 8f8827280d621d8f87197b839db84389ba3b7c1e
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      filter((e: any) => {
        const url: string = e.urlAfterRedirects ?? e.url ?? '';
        return url === '/authority' || url === '/authority/';
      }),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadDashboardData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.crimeService.getAllCrimes().subscribe({
      next: (res: any) => {
<<<<<<< HEAD

        const data: any[] =
          Array.isArray(res) ? res :
            Array.isArray(res?.data) ? res.data :
              Array.isArray(res?.crimes) ? res.crimes :
                Array.isArray(res?.reports) ? res.reports :
                  [];
=======
        // Normalize: API may return a plain array or a wrapped object.
        // Without this guard, data.filter() silently fails on an object,
        // leaving the counts at their previous (stale) values.
        const data: any[] =
          Array.isArray(res)          ? res          :
          Array.isArray(res?.data)    ? res.data    :
          Array.isArray(res?.crimes)  ? res.crimes  :
          Array.isArray(res?.reports) ? res.reports :
          [];
>>>>>>> 8f8827280d621d8f87197b839db84389ba3b7c1e

        this.totalReports = data.length;

        this.pendingReports = data.filter(
          c => String(c.status).toUpperCase() === 'PENDING'
        ).length;

        this.resolvedReports = data.filter(
          c => String(c.status).toUpperCase() === 'RESOLVED'
        ).length;

<<<<<<< HEAD

=======
        // Spread before sorting to avoid mutating the original array reference
>>>>>>> 8f8827280d621d8f87197b839db84389ba3b7c1e
        const sorted = [...data].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.recentReports = sorted.slice(0, 4).map(crime => ({
          id: crime._id,
          type: crime.crimeType,
          location: crime.location,
          status: String(crime.status).toUpperCase()
        }));

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
      }
    });
  }

  logout(): void {
    alert("Logged out successfully.");
    this.router.navigate(['/']);
  }

  getStatusClass(status: string): string {
<<<<<<< HEAD

=======
    // Convert status to lowercase and replace underscores/spaces with hyphens
>>>>>>> 8f8827280d621d8f87197b839db84389ba3b7c1e
    return status.toLowerCase().replace(/_/g, '-').replace(/ /g, '-');
  }
}
