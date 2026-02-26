import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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

  ngOnInit(): void {

    if (typeof window !== 'undefined' && window.localStorage) {

      const user = JSON.parse(localStorage.getItem('authority_user') || '{}');

      this.userName = user?.name || 'Authority';
      this.userRole = user?.role || 'Officer';
      this.isSuperAdmin = user?.role === 'ADMIN';

    }

  }
}
