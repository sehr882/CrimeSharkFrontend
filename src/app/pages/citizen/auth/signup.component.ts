import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  template: `
    <p class="notice">
      This portal is anonymous — no phone or email required.<br>
      Please remember your password, as it cannot be recovered.
    </p>

    <form (ngSubmit)="signup()">
      <div class="form-group">
        <label>Username</label>
        <input type="text" [(ngModel)]="username" name="username" required />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" [(ngModel)]="password" name="password" required />
      </div>

      <div class="form-group">
        <label>Confirm Password</label>
        <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required />
      </div>

      <button type="submit" class="btn-submit">Sign Up</button>
    </form>
  `,
  styles: [`
    .notice {
      font-size: 14px;
      color: #ff6b6b;
      margin-bottom: 20px;
      line-height: 1.5;
      text-align: center;
    }

    form { display: flex; flex-direction: column; gap: 20px; }

    .form-group { display: flex; flex-direction: column; text-align: left; }
    label { margin-bottom: 5px; font-weight: 600; font-size: 14px; color: #ccc; }
    input { padding: 12px; font-size: 16px; border-radius: 8px; border: 1px solid #333; background: #2c2c2c; color: #f0f0f0; outline: none; }
    input::placeholder { color: #888; }
    input:focus { border-color: #00bfff; box-shadow: 0 0 6px rgba(0,191,255,0.3); }

    .btn-submit {
      padding: 14px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 8px;
      background: #007bff;
      color: #fff;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-submit:hover { background: #0056b3; }

    @media (max-width: 480px) {
      input { font-size: 14px; }
      .btn-submit { font-size: 14px; padding: 12px; }
    }
  `]
})
export class SignupComponent {

  username = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  ngOnInit() {
  this.username = '';
  this.password = '';
  this.confirmPassword = '';
}


  signup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const exists = users.find((u: any) => u.username === this.username);
    if (exists) {
      alert('Username already exists');
      return;
    }

    users.push({
      username: this.username,
      password: this.password
    });

    localStorage.setItem('users', JSON.stringify(users));

    alert('Signup successful!');
    this.resetForm();
    this.router.navigate(['/citizen']); // Citizen portal
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
