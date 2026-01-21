import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-citizen-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './citizen-navbar.component.html',
  styleUrls: ['./citizen-navbar.component.scss']
})
export class CitizenNavbarComponent {
   constructor(
  private router: Router
) {}
   goToReport() {
  localStorage.setItem('postLoginRedirect', '/report');
  this.router.navigate(['/citizen/auth']);
}
}

