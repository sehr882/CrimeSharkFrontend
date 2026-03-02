import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-authority-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './authority-navbar.component.html',
  styleUrls: ['./authority-navbar.component.scss']
})
export class AuthorityNavbarComponent implements OnInit {

  userName = '';
  userRole = '';
  isSuperAdmin = false;

  // Computed route paths based on role
  homeLink = '/authority';
  reportsLink = '/authority/reports';
  casesLink = '/authority/case-assignment';
  profileLink = '/authority/officers';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('authority_user') || '{}');

      this.userName = user?.name || 'Authority';
      this.userRole = user?.role || 'Officer';
      this.isSuperAdmin = (user?.role ?? '').toUpperCase() === 'ADMIN';

      if (this.isSuperAdmin) {
        this.homeLink    = '/authority';
        this.reportsLink = '/authority/reports';
        this.casesLink   = '/authority/case-assignment';
        this.profileLink = '/authority/officers';
      } else {
        this.homeLink    = '/officer';
        this.reportsLink = '/officer/reports';
        this.casesLink   = '/officer/cases';
        this.profileLink = '/officer/profile';
      }
    }
  }
}
