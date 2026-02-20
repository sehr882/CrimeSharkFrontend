import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';


interface Report {
  id: number;
  crimeType: string;
  location: string;
  date: string;
  status: 'Pending' | 'In Review' | 'Closed';
}

@Component({
  selector: 'app-authority-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BackButtonComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  testClick(id: any) {
    console.log('Clicked ID:', id);
  }


  search = '';
  statusFilter = '';

  reports: Report[] = [
    { id: 101, crimeType: 'Robbery', location: 'Model Town, Lahore', date: '2026-01-10', status: 'Pending' },
    { id: 102, crimeType: 'Burglary', location: 'Gulberg, Lahore', date: '2026-01-11', status: 'In Review' },
    { id: 103, crimeType: 'Cyber Crime', location: 'Islamabad', date: '2026-01-12', status: 'Closed' },
    { id: 104, crimeType: 'Assault', location: 'Karachi', date: '2026-01-13', status: 'Pending' }
  ];

  filteredReports() {
    return this.reports.filter(r => {
      const matchesSearch =
        this.search
          ? r.crimeType.toLowerCase().includes(this.search.toLowerCase()) ||
          r.location.toLowerCase().includes(this.search.toLowerCase())
          : true;

      const matchesStatus =
        this.statusFilter ? r.status === this.statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }
}
