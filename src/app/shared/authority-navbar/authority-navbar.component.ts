import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      const user = JSON.parse(localStorage.getItem('authorityUser') || '{}');

      this.userName = user?.name || '';
      this.userRole = user?.role || '';
      this.isSuperAdmin = user?.role === 'super_admin';
    }
  }

}
