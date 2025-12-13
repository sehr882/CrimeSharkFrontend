import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-authority-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authority-login.component.html',
  styleUrls: ['./authority-login.component.scss']
})
export class AuthorityLoginComponent implements OnDestroy {

  cnic = '';
  password = '';
  accessCode = '';

  private readonly AUTH_SECRET = 'CS-AUTH-2025';

  private routerSub: Subscription;

  constructor(private router: Router) {

    // 🔁 CLEAR FORM EVERY TIME ROUTE IS ENTERED
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.includes('authority/login')) {
          this.resetForm();
        }
      });
  }

  resetForm() {
    this.cnic = '';
    this.password = '';
    this.accessCode = '';
  }

  login() {
    if (!this.cnic || !this.password || !this.accessCode) {
      alert('All fields are required.');
      return;
    }

    if (this.accessCode !== this.AUTH_SECRET) {
      alert('Invalid Authority Access Code.');
      return;
    }

    this.resetForm();
    this.router.navigate(['/authority/portal']);
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}
