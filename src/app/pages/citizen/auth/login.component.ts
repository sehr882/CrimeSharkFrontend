import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@app/state/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() redirectFrom: string | null = null;

  @Output() switchToSignup = new EventEmitter<void>();

  form: FormGroup;
  errorMessage = '';

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authStore = inject(AuthStore);

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() { this.form.reset(); }

  get f() { return this.form.controls; }

  goToSignup() {
    this.switchToSignup.emit();
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    // AuthStore handles token persistence and session shape — components
    // no longer touch localStorage directly.
    this.authStore.loginCitizen(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigate([this.redirectFrom ?? '/citizen']);
      },
      error: err => {
        const msg = err.error?.message;
        this.errorMessage = Array.isArray(msg) ? msg.join(', ') : msg || 'Login failed';
      }
    });
  }
}
