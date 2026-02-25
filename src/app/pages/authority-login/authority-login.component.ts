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

  cnic = '';
  password = '';
  accessCode = '';

  // Temporary Secret (later backend will handle this)
  private readonly AUTH_SECRET = 'CS-AUTH-2025';

  constructor(private router: Router) { }

  login() {

    if (!this.cnic || !this.password || !this.accessCode) {
      alert('All fields are required.');
      return;
    }

    if (this.accessCode !== this.AUTH_SECRET) {
      alert('Invalid Authority Access Code.');
      return;
    }

    // 🔥 Temporary Dummy Logic (until backend is ready)

    let user;

    if (this.cnic === '1111') {
      user = {
        name: 'Ali Khan',
        role: 'super_admin'
      };
    } else {
      user = {
        name: 'Ahmed Raza',
        role: 'officer'
      };
    }

    // Store in localStorage
    localStorage.setItem('authorityUser', JSON.stringify(user));

    this.router.navigate(['/authority']);
  }
}