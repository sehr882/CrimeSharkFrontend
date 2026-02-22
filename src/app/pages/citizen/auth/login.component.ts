import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from  '@app/services/auth.service'; // ⬅ inject AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @Input() redirectFrom: string | null = null;

  username = '';
  password = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.username = '';
    this.password = '';
  }

  login() {
    const data = {
      username: this.username,
      password: this.password
    };

    this.authService.login(data).subscribe({
      next: res => {
        // Store user login data
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify({
            username: this.username,
            loginTime: new Date().toISOString()
          }));
          localStorage.setItem('isLoggedIn', 'true');
        }

        alert('Login successful!');
        this.resetForm();

        // redirect logic
        if (this.redirectFrom) {
          this.router.navigate([this.redirectFrom]);
        } else {
          this.router.navigate(['/citizen']);
        }
      },
      error: err => {
        alert(err.error?.message || 'Login failed');
        console.error(err);
      }
    });
  }

  resetForm() {
    this.username = '';
    this.password = '';
  }
}