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
  remarks = '';

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
}
