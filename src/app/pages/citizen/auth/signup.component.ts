import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Input } from '@angular/core';

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

  @Input() redirectFrom: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
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
    const redirect = localStorage.getItem('postLoginRedirect');

    if (redirect) {
      localStorage.removeItem('postLoginRedirect');
      this.router.navigate([redirect]);
    } else {
      this.router.navigate(['/citizen']);
    }
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
