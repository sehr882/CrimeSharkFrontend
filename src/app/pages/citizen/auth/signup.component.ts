import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

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

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
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

  signup() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.register({
      username: this.f['username'].value,
      password: this.f['password'].value
    }).subscribe({
      next: res => {
        alert(res.message || 'Signup successful!');
        this.form.reset();
        this.router.navigate([this.redirectFrom ?? '/citizen']);
      },
      error: err => {
        const msg = err.error?.message;
        alert(Array.isArray(msg) ? msg.join(', ') : msg || 'Signup failed');
      }
    });
  }
}
