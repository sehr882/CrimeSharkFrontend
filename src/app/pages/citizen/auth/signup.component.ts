import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { AuthStore } from '@app/state/auth.store';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @Input() redirectFrom: string | null = null;

  // Parent (auth.component) listens to flip the visible tab.
  @Output() switchToLogin = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;
  errorMessage = '';

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);

  constructor() {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit() { this.form.reset(); }

  get f() { return this.form.controls; }

  goToLogin() {
    this.switchToLogin.emit();
  }

  signup() {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    const username = this.f['username'].value as string;
    const password = this.f['password'].value as string;

    this.submitting = true;
    this.errorMessage = '';

    // Register, then immediately log the new user in so they're not bounced
    // to the login screen with their just-typed password.
    this.authService.register({ username, password }).subscribe({
      next: () => {
        this.authStore.loginCitizen({ username, password }).subscribe({
          next: () => {
            this.submitting = false;
            this.form.reset();
            this.router.navigate([this.redirectFrom ?? '/citizen']);
          },
          error: () => {
            // Account was created but auto-login failed — bounce to login tab
            // so the user can try once manually.
            this.submitting = false;
            this.errorMessage = 'Account created. Please sign in.';
            this.switchToLogin.emit();
          }
        });
      },
      error: err => {
        this.submitting = false;
        const msg = err.error?.message;
        this.errorMessage = Array.isArray(msg) ? msg.join(', ') : msg || 'Signup failed';
      }
    });
  }
}
