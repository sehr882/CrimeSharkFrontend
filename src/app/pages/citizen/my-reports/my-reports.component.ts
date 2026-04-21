import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service';

@Component({
  selector: 'app-my-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.scss']
})
export class MyReportsComponent implements OnInit, OnDestroy {

  reports: any[] = [];
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(private crimeService: CrimeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadReports();

      // Re-fetch if status was updated elsewhere in the same session
      this.crimeService.statusUpdated$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadReports());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReports(): void {
    this.crimeService.getMyCrimes().subscribe({
      next: (res: any[]) => {
        this.reports = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.loading = false;
      }
    });
  }
}
