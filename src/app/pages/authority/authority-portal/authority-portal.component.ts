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
  ) { }

  ngOnInit(): void {

    this.loadDashboardData();


    this.crimeService.statusUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadDashboardData());


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

        const data: any[] =
          Array.isArray(res) ? res :
            Array.isArray(res?.data) ? res.data :
              Array.isArray(res?.crimes) ? res.crimes :
                Array.isArray(res?.reports) ? res.reports :
                  [];

        this.totalReports = data.length;

        this.pendingReports = data.filter(
          c => String(c.status).toUpperCase() === 'PENDING'
        ).length;

        this.resolvedReports = data.filter(
          c => String(c.status).toUpperCase() === 'RESOLVED'
        ).length;


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

    return status.toLowerCase().replace(/_/g, '-').replace(/ /g, '-');
  }
}
