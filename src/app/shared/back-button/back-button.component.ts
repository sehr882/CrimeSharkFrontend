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

    if (currentUrl.startsWith('/authority')) {

      if (currentUrl === '/authority') {
        this.router.navigate(['/']);
      }
      else {
        this.router.navigate(['/authority']);
      }
    }
    else if (currentUrl.startsWith('/officer')) {

      if (currentUrl === '/officer') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/officer']);
      }
    }

    else if (currentUrl.startsWith('/citizen')) {

      if (currentUrl === '/citizen') {
        this.router.navigate(['/']);
      }
      else {
        this.router.navigate(['/citizen']);
      }
    }


    else {
      this.router.navigate(['/']);
    }
  }
}

