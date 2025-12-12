import { Component, OnInit } from '@angular/core';
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
export class AuthorityLoginComponent implements OnInit {

  cnic = '';
  password = '';
  accessCode = '';

  ngOnInit() {
    this.cnic = '';
    this.password = '';
    this.accessCode = '';
  }

  private readonly FIXED_CNIC = '35202-1234567-8';
  private readonly FIXED_PASSWORD = 'admin123';

  // 👉 SECRET AUTH ACCESS CODE
  private readonly AUTH_SECRET = 'CS-AUTH-2025';

  constructor(private router: Router) {}

  login() {

    // EMPTY FIELD CHECK
    if (!this.cnic || !this.password || !this.accessCode) {
      alert('All fields are required.');
      return;
    }

    // ACCESS CODE CHECK
    if (this.accessCode !== this.AUTH_SECRET) {
      alert('Invalid Authority Access Code.');
      return;
    }

    // CREDENTIAL MATCH CHECK
    if (this.cnic !== this.FIXED_CNIC || this.password !== this.FIXED_PASSWORD) {
      alert('Invalid CNIC or Password.');
      return;
    }

    // SUCCESS → redirect to dashboard
    this.router.navigate(['/authority/portal']);

  }
}

