import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrimeService } from 'src/app/services/crime.service';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss'],
})
export class ReportDetailsComponent implements OnInit {

  report: any;
  selectedStatus = '';

  updating = false;
  updateSuccess = false;
  updateError = '';

  constructor(
    private route: ActivatedRoute,
    private crimeService: CrimeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.crimeService.getCrimeById(id).subscribe({
          next: (data) => {
            this.report = data;
            this.selectedStatus = data?.status || 'PENDING';
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('API error:', err);
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  updateStatus(): void {
    if (!this.report?._id || !this.selectedStatus) return;

    this.updating = true;
    this.updateSuccess = false;
    this.updateError = '';

    this.crimeService.updateReportStatus(this.report._id, this.selectedStatus).subscribe({
      next: (res) => {
        // Reflect the backend-confirmed status on the page
        this.report = { ...this.report, status: res?.status ?? this.selectedStatus };
        this.updating = false;
        this.updateSuccess = true;

        // Signal all subscribed components to refresh
        this.crimeService.statusUpdated$.next(this.report._id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.updateError = err?.error?.message || 'Failed to update status. Please try again.';
        this.updating = false;
        this.cdr.detectChanges();
      }
    });
  }
}
