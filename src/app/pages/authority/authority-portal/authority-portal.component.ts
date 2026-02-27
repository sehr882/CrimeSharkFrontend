import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-authority-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './authority-portal.component.html',
  styleUrls: ['./authority-portal.component.scss']
})
export class AuthorityPortalComponent implements OnInit {

  totalReports = 0;
  pendingReports = 0;
  resolvedReports = 0;

  recentReports: any[] = [];

  constructor(
    private router: Router,
    private crimeService: CrimeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

 loadDashboardData(): void {
  console.log("LOAD DASHBOARD RUNNING");

  this.crimeService.getAllCrimes().subscribe({
    next: (data: any[]) => {

      console.log("INSIDE NEXT BLOCK");
      console.log("DATA LENGTH:", data.length);

      // Always set total first
      this.totalReports = data.length;

      // Normalize status safely
      this.pendingReports = data.filter(c =>
        String(c.status).toUpperCase() === 'PENDING'
      ).length;

      this.resolvedReports = data.filter(c =>
        String(c.status).toUpperCase() === 'RESOLVED'
      ).length;

      // Sort newest first
      const sorted = data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Map for table
      this.recentReports = sorted.slice(0, 4).map(crime => ({
        id: crime._id,
        type: crime.crimeType,
        location: crime.location,
        status: String(crime.status).toUpperCase()
      }));
       this.cdr.detectChanges();

      console.log("TOTAL:", this.totalReports);
      console.log("PENDING:", this.pendingReports);
      console.log("RESOLVED:", this.resolvedReports);
    },
    error: (err) => {
      console.error('Error loading crimes:', err);
    }
  });
}

  logout(): void {
    alert("Logged out successfully.");
    this.router.navigate(['/']);
  }
}