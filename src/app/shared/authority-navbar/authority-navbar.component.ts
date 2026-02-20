import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-authority-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './authority-navbar.component.html',
  styleUrls: ['./authority-navbar.component.scss']
})
export class AuthorityNavbarComponent {
  constructor(private router: Router) {}
  
    logout() {
      alert("Logged out successfully.");
      this.router.navigate(['/']);
    }
}
