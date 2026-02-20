import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Input } from '@angular/core';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.username = '';
    this.password = '';
  }

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find(
      (u: any) =>
        u.username === this.username && u.password === this.password
    );

    if (!user) {
      alert('Invalid username or password');
      return;
    }

    localStorage.setItem('loggedInUser', this.username);

    alert('Login successful!');

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
  }
}
