import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-authority-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
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


  constructor(private router: Router) { }

  logout() {
    alert("Logged out successfully.");
    this.router.navigate(['/']);
  }
}


