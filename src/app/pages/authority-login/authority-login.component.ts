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

  // 🔁 Toggle (Signup default)
  isSignup = true;

  // Signup fields
  signupCnic = '';
  signupPassword = '';
  signupAccessCode = '';

  // Login fields
  cnic = '';
  password = '';
  accessCode = '';

  private readonly AUTH_SECRET = 'CS-AUTH-2025';
  private routerSub: Subscription;

  constructor(private router: Router) {

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.includes('authority/login')) {
          this.resetForm();
        }
      });
  }

  toggleForm(val: boolean) {
    this.isSignup = val;
    this.resetForm();
  }

  resetForm() {
    this.cnic = '';
    this.password = '';
    this.accessCode = '';
    this.signupCnic = '';
    this.signupPassword = '';
    this.signupAccessCode = '';
  }

  signup() {
    if (!this.signupCnic || !this.signupPassword || !this.signupAccessCode) {
      alert('All fields are required.');
      return;
    }

    if (this.signupAccessCode !== this.AUTH_SECRET) {
      alert('Invalid Authority Access Code.');
      return;
    }

    const authorities = JSON.parse(localStorage.getItem('authorities') || '[]');

    // 🚫 Prevent duplicate CNIC
    const existing = authorities.find(
      (a: any) => a.cnic === this.signupCnic
    );

    if (existing) {
      alert('Authority account already exists.');
      return;
    }

    authorities.push({
      cnic: this.signupCnic,
      password: this.signupPassword
    });

    localStorage.setItem('authorities', JSON.stringify(authorities));

    alert('Authority account created successfully!');

    this.resetForm();

    // 🔥 Navigate directly to dashboard
    this.router.navigate(['/authority']);
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

    const authorities = JSON.parse(localStorage.getItem('authorities') || '[]');

    const user = authorities.find(
      (a: any) =>
        a.cnic === this.cnic &&
        a.password === this.password
    );

    if (!user) {
      alert('Invalid CNIC or password.');
      return;
    }

    this.resetForm();
    this.router.navigate(['/authority']);
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}