import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorityAuthService } from '../../services/authority-auth.service';

@Component({
  selector: 'app-authority-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authority-login.component.html',
  styleUrls: ['./authority-login.component.scss']
})
export class AuthorityLoginComponent {

  cnic: string = '';
  password: string = '';
  accessCode: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authorityAuthService: AuthorityAuthService
  ) { }

  login() {

    console.log('Login button clicked');
    if (!this.cnic || !this.password || !this.accessCode) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const loginData = {
      cnic: this.cnic,
      password: this.password,
      accessCode: this.accessCode
    };
    this.authorityAuthService.login(loginData).subscribe({
      next: (response: any) => {

        localStorage.setItem('token', response.access_token);

        const payload = JSON.parse(atob(response.access_token.split('.')[1]));
        const role = payload.role;

        if (role === 'ADMIN') {
          localStorage.setItem('authority_user', JSON.stringify(response.authority));
          this.router.navigate(['/authority']);
        }
        else if (role === 'officer') {
          localStorage.setItem('authority_user', JSON.stringify(response.officer));
          this.router.navigate(['/officer']);
        }
      },
      error: (error: any) => {
        this.errorMessage = error?.error?.message || 'Login failed';
      }
    });
  }
}