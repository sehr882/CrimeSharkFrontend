import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../../state/auth.store';

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

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  constructor() {
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

    // AuthStore decodes role from JWT, normalises casing, persists session.
    this.authStore.loginAuthority(this.form.value).subscribe({
      next: () => {
        const target = this.authStore.isAdmin() ? '/authority' : '/officer';
        this.router.navigate([target]);
      },
      error: (error: any) => {
        this.errorMessage = error?.error?.message || 'Login failed';
      }
    });
  }
}
