import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from 'src/app/services/crime.service';

@Component({
  selector: 'app-authority-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BackButtonComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  search = '';
  statusFilter = '';

  reports: any[] = [];
  filteredReportsList: any[] = [];

  loading = false;
  error: string | null = null;

  constructor(
    private crimeService: CrimeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('REPORT LIST COMPONENT LOADED');

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

        const mappedReports = rows.map((item: any) => ({
          ...item,
          crimeTitle: item?.crimeTitle ?? item?.title ?? item?.crimeType ?? 'Untitled',
          dateOfCrime: item?.dateOfCrime ?? item?.createdAt ?? null,
          location: item?.location ?? '',
          crimeType: item?.crimeType ?? '',
          status: item?.status ?? ''
        }));

        // IMPORTANT: assign new references
        this.reports = [...mappedReports];

        this.updateFilteredReports();

        this.loading = false;

        console.log('Reports loaded:', this.filteredReportsList.length);
        
        // Force change detection
        this.cdr.detectChanges();

      },

      error: (err: any) => {

        console.error('API Error:', err);

        this.error =
          err?.error?.message ||
          err?.message ||
          'Failed to load reports';

        this.reports = [];
        this.filteredReportsList = [];

        this.loading = false;
        
        // Force change detection
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
        !q ||
        crimeType.includes(q) ||
        location.includes(q);

      const matchesStatus =
        !this.statusFilter ||
        r.status === this.statusFilter;

      return matchesSearch && matchesStatus;

    });

    // CRITICAL: new reference to trigger Angular rendering
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


  trackByReportId(index: number, report: any): string {
    return report._id;
  }

}