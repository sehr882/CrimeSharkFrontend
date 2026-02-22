import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from  '@app/services/auth.service';  // check relative path

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  username = '';
  password = '';
  confirmPassword = '';

  // signup.component.ts
 @Input() redirectFrom: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

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

    const data = {
      username: this.username,
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: res => {
        alert(res.message || 'Signup successful!');
        this.resetForm();

        // temporary redirect logic
        if (this.redirectFrom) {
          this.router.navigate([this.redirectFrom]);
        } else {
          this.router.navigate(['/citizen']);
        }
      },
      error: err => {
        alert(err.error?.message || 'Signup failed');
        console.error(err);
      }
    });
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
  }
}