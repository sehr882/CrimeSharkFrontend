import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {

  constructor(private router: Router) { }

  goBack() {
    const currentUrl = this.router.url;

    // Authority portal logic
    if (currentUrl.startsWith('/authority')) {

      // If already on dashboard → go to landing
      if (currentUrl === '/authority') {
        this.router.navigate(['/']);
      }
      // Any inner authority page → go to authority dashboard
      else {
        this.router.navigate(['/authority']);
      }
    }

    // Citizen portal logic
    else if (currentUrl.startsWith('/citizen')) {

      // If already on dashboard → go to landing
      if (currentUrl === '/citizen') {
        this.router.navigate(['/']);
      }
      // Any inner citizen page → go to citizen dashboard
      else {
        this.router.navigate(['/citizen']);
      }
    }

    // Fallback → landing
    else {
      this.router.navigate(['/']);
    }
  }
}

