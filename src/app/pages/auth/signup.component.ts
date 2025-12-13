import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
        <label for="username">Username</label>
        <input id="username" type="text" [(ngModel)]="username" name="username" placeholder="Enter your username" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" [(ngModel)]="password" name="password" placeholder="Enter your password" required />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Confirm password" required />
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

  signup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert(`Signup clicked!\nUsername: ${this.username}`);
  }
}