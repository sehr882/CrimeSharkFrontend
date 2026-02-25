import { Component, OnInit } from '@angular/core';
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
    const user = JSON.parse(localStorage.getItem('authorityUser') || '{}');

    this.userName = user.name || 'Authority';
    this.isSuperAdmin = user.role === 'super_admin';
    this.userRole = this.isSuperAdmin ? 'Super Admin' : 'Officer';
  }
}
