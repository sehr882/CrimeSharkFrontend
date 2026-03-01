import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from 'src/app/services/crime.service';

@Component({
  selector: 'app-authority-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BackButtonComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {

  search = '';
  statusFilter = '';

  reports: any[] = [];
  filteredReportsList: any[] = [];

  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private crimeService: CrimeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReports();

    // Refresh list whenever a status is updated from the detail page
    this.crimeService.statusUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadReports());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReports(): void {
    this.loading = true;
    this.error = null;

    this.crimeService.getAllCrimes().subscribe({
      next: (data: any) => {
        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.crimes)
          ? data.crimes
          : Array.isArray(data?.reports)
          ? data.reports
          : [];

        this.reports = rows.map((item: any) => ({
          ...item,
          crimeTitle: item?.crimeTitle ?? item?.title ?? item?.crimeType ?? 'Untitled',
          dateOfCrime: item?.dateOfCrime ?? item?.createdAt ?? null,
          location: item?.location ?? '',
          crimeType: item?.crimeType ?? '',
          status: item?.status ?? ''
        }));

        this.updateFilteredReports();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err?.error?.message || err?.message || 'Failed to load reports';
        this.reports = [];
        this.filteredReportsList = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateFilteredReports(): void {
    const q = this.search?.toLowerCase() || '';

    const filtered = this.reports.filter(r => {
      const crimeType = String(r?.crimeType || '').toLowerCase();
      const location = String(r?.location || '').toLowerCase();

      const matchesSearch =
        !q || crimeType.includes(q) || location.includes(q);

      const matchesStatus =
        !this.statusFilter || r.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.filteredReportsList = [...filtered];
  }

  onSearchChange(): void {
    this.updateFilteredReports();
  }

  onStatusChange(): void {
    this.updateFilteredReports();
  }

  viewReport(id: string): void {
    this.router.navigate(['/authority/reports', id]);
  }

  trackByReportId(_index: number, report: any): string {
    return report._id;
  }
}
