import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignupComponent],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="tabs">
          <span [class.active]="isLogin" (click)="toggleTab(true)">Login</span>
          <span [class.active]="!isLogin" (click)="toggleTab(false)">Sign Up</span>
        </div>
        <div class="tab-content">
          <app-login *ngIf="isLogin"></app-login>
          <app-signup *ngIf="!isLogin"></app-signup>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #121212;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 30px 25px;
      border-radius: 20px;
      background: #1e1e1e;
      box-shadow: 0 10px 35px rgba(0,0,0,0.7);
      text-align: center;
      color: #f0f0f0;
      position: relative;
    }

    .tabs {
      display: flex;
      justify-content: center;
      gap: 50px;
      margin-bottom: 30px;
      position: relative;
      z-index: 20;
    }

    .tabs span {
      font-size: 20px;
      font-weight: 600;
      cursor: pointer;
      padding-bottom: 5px;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;
      color: #ccc;
    }

    .tabs span.active {
      color: #00bfff;
      border-color: #00bfff;
    }

    .tabs span:hover {
      color: #0056b3;
    }
    .tab-content {
  margin-top: 20px;
}

    @media (max-width: 480px) {
      .auth-card { padding: 25px 15px; }
      .tabs { gap: 30px; }
      .tabs span { font-size: 18px; }
    }
  `]
})
export class AuthComponent {
  isLogin = true;

  toggleTab(val: boolean) {
    this.isLogin = val;

    // 🔥 force component recreation
    if (val) {
      this.isLogin = false;
      setTimeout(() => {
        this.isLogin = true;
      });
    }
  }
}


