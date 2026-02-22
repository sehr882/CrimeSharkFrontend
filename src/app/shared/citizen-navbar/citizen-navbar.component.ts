import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citizen-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './citizen-navbar.component.html',
  styleUrls: ['./citizen-navbar.component.scss']
})
export class CitizenNavbarComponent {
  constructor(
    private router: Router
  ) { }

  get isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  }

  goToReport() {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (loggedIn) {
        this.router.navigate(['/citizen/report']);
      } else {
        this.router.navigate(['/citizen/auth']);
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    }
  }
}

