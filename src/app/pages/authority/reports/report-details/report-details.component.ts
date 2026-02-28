import { Component, OnInit, NgZone } from '@angular/core';
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
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.crimeService.getCrimeById(id).subscribe({
          next: (data) => {
            this.ngZone.run(() => {
              this.report = data;
            });
          },
          error: (err) => {
            console.error('API error:', err);
          }
        });
      }
    });
  }
}
