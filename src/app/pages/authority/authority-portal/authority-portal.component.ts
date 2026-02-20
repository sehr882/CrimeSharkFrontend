import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-authority-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule, BackButtonComponent],
  templateUrl: './authority-portal.component.html',
  styleUrls: ['./authority-portal.component.scss']
})
export class AuthorityPortalComponent {

  // Fake analytics
  totalReports = 128;
  pendingReports = 47;
  resolvedReports = 81;

  // Fake recent data
  recentReports = [
    { id: 'R-1021', type: 'Robbery', location: 'Saddar, Rawalpindi', status: 'Pending' },
    { id: 'R-1020', type: 'Harassment', location: 'Commercial Market', status: 'Under Review' },
    { id: 'R-1019', type: 'Theft', location: 'Blue Area, Islamabad', status: 'Resolved' }
  ];

  // 📊 CHART 1 (LINE – Crime Trend)
  lineChartLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  lineChartData = {
    labels: this.lineChartLabels,
    datasets: [
      {
        data: [20, 34, 28, 45, 50, 62],
        label: 'Crime Reports',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // 📊 CHART 2 (PIE – Crime Categories)
  pieChartLabels = ['Robbery', 'Assault', 'Harassment', 'Theft', 'Fraud'];
  pieChartData = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [30, 20, 18, 25, 10]
      }
    ]
  };

  // 📊 CHART 3 (BAR – Pending vs Resolved)
  barChartLabels = ['Cases'];
  barChartData = {
    labels: this.barChartLabels,
    datasets: [
      { label: 'Pending', data: [this.pendingReports] },
      { label: 'Resolved', data: [this.resolvedReports] }
    ]
  };

  constructor(private router: Router) { }

  logout() {
    alert("Logged out successfully.");
    this.router.navigate(['/']);
  }
}


