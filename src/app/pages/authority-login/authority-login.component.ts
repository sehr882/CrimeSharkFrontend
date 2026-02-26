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
  ) {}

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
      next: (response:any) => {

        const user = response.authority;

        if (user.role === 'ADMIN') {
          this.router.navigate(['/authority']);
        } 
      },
      error: (error:any) => {
        this.errorMessage = error?.error?.message || 'Login failed';
      }
    });
  }
}