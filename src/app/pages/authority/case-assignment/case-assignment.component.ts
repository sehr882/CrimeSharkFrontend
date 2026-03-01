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
  pageTitle = '';
  pageSubtitle = '';

  crimes: any[] = [];
  officers: any[] = [];

  // Tracks the selected officer ID per crime card: { crimeId -> officerId }
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
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.currentUser = JSON.parse(localStorage.getItem('authority_user') || '{}');
      this.role = this.currentUser?.role ?? '';
    }

    if (this.role === 'ADMIN') {
      this.pageTitle = 'Case Assignment';
      this.pageSubtitle = 'Assign cases to available officers';
    } else {
      this.pageTitle = 'My Cases';
      this.pageSubtitle = 'Cases assigned to you';
    }

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      crimes: this.crimeService.getAllCrimes(),
      officers: this.officerService.getAllOfficers()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ crimes, officers }) => {
          // Normalize crimes response
          const rows: any[] = Array.isArray(crimes)
            ? crimes
            : Array.isArray(crimes?.data) ? crimes.data
            : Array.isArray(crimes?.crimes) ? crimes.crimes
            : Array.isArray(crimes?.reports) ? crimes.reports
            : [];

          // Normalize officers response (cast to any first to avoid type-narrowing to never)
          const rawOfficers: any = officers;
          this.officers = Array.isArray(rawOfficers)
            ? rawOfficers
            : Array.isArray(rawOfficers?.data) ? rawOfficers.data
            : [];

          let allCrimes = rows.map((c: any) => ({
            ...c,
            crimeTitle: c?.crimeTitle ?? c?.title ?? c?.crimeType ?? 'Untitled',
            dateOfCrime: c?.dateOfCrime ?? c?.createdAt ?? null,
            location: c?.location ?? '',
            status: c?.status ?? 'PENDING',
            assignedOfficer: c?.assignedOfficer ?? null
          }));

          // Officers see only their own assigned crimes
          if (this.role !== 'ADMIN') {
            const myId = this.currentUser?._id;
            allCrimes = allCrimes.filter(c => {
              const ao = c.assignedOfficer;
              if (!ao) return false;
              return (typeof ao === 'object' ? ao._id : ao) === myId;
            });
          }

          this.crimes = allCrimes;

          // Pre-populate dropdown selections with existing assignments
          this.crimes.forEach(c => {
            const ao = c.assignedOfficer;
            if (ao) {
              this.selectedOfficerMap[c._id] = typeof ao === 'object' ? ao._id : ao;
            }
          });

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.error = err?.error?.message || err?.message || 'Failed to load data';
          this.loading = false;
          this.cdr.detectChanges();
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
          // Update the card in-place so the UI reflects immediately
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
    // ao is just an ID string — look it up in the officers list
    const found = this.officers.find(o => o._id === ao);
    return found?.name ?? found?.officerName ?? 'Unknown';
  }

  trackByCrimeId(_index: number, crime: any): string {
    return crime._id;
  }
}
