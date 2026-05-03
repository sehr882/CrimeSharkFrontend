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
    const url = this.router.url.split('?')[0];

    // Authority back-stack stays hierarchical: detail -> list -> portal -> home
    if (url.startsWith('/authority')) {
      if (url === '/authority') {
        this.router.navigate(['/']);
      } else if (/^\/authority\/reports\/.+/.test(url)) {
        this.router.navigate(['/authority/reports']);
      } else if (url.startsWith('/authority/add-officer')) {
        this.router.navigate(['/authority/officers']);
      } else {
        this.router.navigate(['/authority']);
      }
    } else if (url.startsWith('/officer')) {
      if (url === '/officer') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/officer']);
      }
    } else if (url.startsWith('/citizen')) {
      // Citizen sub-pages return to the citizen portal; portal root returns home.
      if (url === '/citizen') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/citizen']);
      }
    } else if (url.startsWith('/live-alerts')) {
      // /live-alerts is public and shares the citizen layout; treat it the same.
      this.router.navigate(['/citizen']);
    } else {
      this.router.navigate(['/']);
    }
  }
}

