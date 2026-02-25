import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service';

@Component({
  selector: 'app-my-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.scss']
})
export class MyReportsComponent implements OnInit {

  reports: any[] = [];
  loading = true;

  constructor(private crimeService: CrimeService) {}

  ngOnInit(): void {

    // ✅ Only run in browser
    if (typeof window !== 'undefined') {
      this.loadReports();
    }
  }

  loadReports() {

    console.log('Calling API...');

    this.crimeService.getMyCrimes().subscribe({
      next: (res: any[]) => {
        console.log('Response:', res);
        this.reports = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.loading = false;
      }
    });
  }

}