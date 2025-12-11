import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authority-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authority-login.component.html',
  styleUrls: ['./authority-login.component.scss']
})
export class AuthorityLoginComponent {

  authorityId = '';
  password = '';
  accessCode = '';

  // 👉 SECRET AUTH ACCESS CODE (ONLY AUTHORITIES KNOW THIS)
  private readonly AUTH_SECRET = 'CS-AUTH-2025';

  constructor(private router: Router) {}

  login() {
    if (!this.authorityId || !this.password || !this.accessCode) {
      alert('All fields are required.');
      return;
    }

    if (this.accessCode !== this.AUTH_SECRET) {
      alert('Invalid Authority Access Code.');
      return;
    }

    // If everything matches, go to Authority Portal Dashboard
    this.router.navigate(['/authority/dashboard']);
  }
}

