import { Component, OnInit } from '@angular/core';
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

  constructor(
    private crimeService: CrimeService,
    private router: Router
  ) {}

  ngOnInit(): void {
     console.log('REPORT LIST COMPONENT LOADED');
    this.loadReports();
  }

loadReports() {
  this.crimeService.getAllCrimes().subscribe(data => {
    this.reports = [...data]; // force new reference
  });
}
  filteredReports() {
    return this.reports.filter(r => {

      const matchesSearch =
        this.search
          ? r.crimeType?.toLowerCase().includes(this.search.toLowerCase()) ||
            r.location?.toLowerCase().includes(this.search.toLowerCase())
          : true;

      const matchesStatus =
        this.statusFilter
          ? r.status === this.statusFilter
          : true;

      return matchesSearch && matchesStatus;
    });
  }

  viewReport(id: string) {
    this.router.navigate(['/authority/reports', id]);
  }
}