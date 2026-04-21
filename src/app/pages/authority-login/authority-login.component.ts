import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorityAuthService } from '../../services/authority-auth.service';

@Component({
  selector: 'app-authority-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authority-login.component.html',
  styleUrls: ['./authority-login.component.scss']
})
export class AuthorityLoginComponent {

  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authorityAuthService: AuthorityAuthService
  ) {
    this.form = this.fb.group({
      cnic: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{7}-\d{1}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      accessCode: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authorityAuthService.login(this.form.value).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.access_token);

        const payload = JSON.parse(atob(response.access_token.split('.')[1]));
        const role = payload.role;

        if (role === 'ADMIN') {
          localStorage.setItem('authority_user', JSON.stringify(response.authority));
          this.router.navigate(['/authority']);
        } else if (role === 'officer') {
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
