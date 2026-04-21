import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() redirectFrom: string | null = null;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() { this.form.reset(); }

  get f() { return this.form.controls; }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.login(this.form.value).subscribe({
      next: (res: any) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify({
            username: this.f['username'].value,
            loginTime: new Date().toISOString()
          }));
          localStorage.setItem('isLoggedIn', 'true');
        }
        alert('Login successful!');
        this.form.reset();
        this.router.navigate([this.redirectFrom ?? '/citizen']);
      },
      error: err => {
        const msg = err.error?.message;
        alert(Array.isArray(msg) ? msg.join(', ') : msg || 'Login failed');
      }
    });
  }
}
