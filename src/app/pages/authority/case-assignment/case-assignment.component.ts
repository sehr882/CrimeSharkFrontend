import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from 'src/app/services/crime.service';
import { OfficerService } from 'src/app/services/officer.service';

@Component({
  selector: 'app-case-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './case-assignment.component.html',
  styleUrls: ['./case-assignment.component.scss']
})
export class CaseAssignmentComponent implements OnInit, OnDestroy {

  role = '';
  currentUser: any;
  officerId = '';
  pageTitle = '';
  pageSubtitle = '';

  crimes: any[] = [];
  officers: any[] = [];

  selectedOfficerMap: { [crimeId: string]: string } = {};

  loading = false;
  assigningId: string | null = null;
  error: string | null = null;
  successMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private crimeService: CrimeService,
    private officerService: OfficerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.currentUser = JSON.parse(localStorage.getItem('authority_user') || '{}');
      this.role = (this.currentUser?.role ?? '').toUpperCase();

      if (this.role !== 'ADMIN') {
        this.officerId = this.resolveOfficerId();
      }
    }

    this.pageTitle = this.role === 'ADMIN' ? 'Case Assignment' : 'My Cases';
    this.pageSubtitle = this.role === 'ADMIN' ? 'Assign cases to available officers' : 'Cases assigned to you';

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private resolveOfficerId(): string {
    const token = localStorage.getItem('authority_token') || localStorage.getItem('token') || '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.sub) return payload.sub;
      } catch { }
    }
    return this.currentUser?._id ?? this.currentUser?.id ?? '';
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    if (this.role === 'ADMIN') {
      forkJoin({
        crimes: this.crimeService.getAllCrimes(),
        officers: this.officerService.getAllOfficers()
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ({ crimes, officers }) => {
            const rawOfficers: any = officers;
            this.officers = Array.isArray(rawOfficers)
              ? rawOfficers
              : Array.isArray(rawOfficers?.data) ? rawOfficers.data : [];

            this.crimes = this.normalizeCrimes(crimes);
            this.preselectOfficers();
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            this.error = err?.error?.message || err?.message || 'Failed to load data';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });

    } else {

      if (!this.officerId) {
        this.error = 'Unable to determine officer ID. Please log in again.';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.crimeService.getCrimesByOfficer(this.officerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.crimes = this.normalizeCrimes(res);
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err: any) => {
            this.error = err?.error?.message || err?.message || 'Failed to load cases';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
    }
  }

  private normalizeCrimes(raw: any): any[] {
    const rows: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data) ? raw.data
        : Array.isArray(raw?.crimes) ? raw.crimes
          : Array.isArray(raw?.reports) ? raw.reports
            : [];

    return rows.map((c: any) => ({
      ...c,
      crimeTitle: c?.crimeTitle ?? c?.title ?? c?.crimeType ?? 'Untitled',
      dateOfCrime: c?.dateOfCrime ?? c?.createdAt ?? null,
      location: c?.location ?? '',
      status: c?.status ?? 'PENDING',
      assignedOfficer: c?.assignedOfficer ?? null
    }));
  }

  private preselectOfficers(): void {
    this.crimes.forEach(c => {
      const ao = c.assignedOfficer;
      if (ao) {
        this.selectedOfficerMap[c._id] = typeof ao === 'object' ? ao._id : ao;
      }
    });
  }

  assignOfficer(crime: any): void {
    const officerId = this.selectedOfficerMap[crime._id];
    if (!officerId) return;

    this.assigningId = crime._id;
    this.successMessage = null;
    this.error = null;

    this.crimeService.assignOfficer(crime._id, officerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const officer = this.officers.find(o => o._id === officerId);
          crime.assignedOfficer = officer ?? { _id: officerId };

          this.assigningId = null;
          this.successMessage = 'Officer assigned successfully';
          this.cdr.detectChanges();

          setTimeout(() => {
            this.successMessage = null;
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err: any) => {
          this.error = err?.error?.message || err?.message || 'Assignment failed';
          this.assigningId = null;
          this.cdr.detectChanges();
        }
      });
  }

  getAssignedOfficerName(crime: any): string {
    const ao = crime?.assignedOfficer;
    if (!ao) return 'Unassigned';

    if (typeof ao === 'object') {
      return ao.name ?? ao.officerName ?? 'Unknown';
    }

    const found = this.officers.find(o => o._id === ao);
    return found?.name ?? found?.officerName ?? 'Unknown';
  }

  trackByCrimeId(_index: number, crime: any): string {
    return crime._id;
  }
}
