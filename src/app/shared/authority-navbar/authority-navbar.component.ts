import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../state/auth.store';

@Component({
  selector: 'app-authority-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './authority-navbar.component.html',
  styleUrls: ['./authority-navbar.component.scss']
})
export class AuthorityNavbarComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  readonly userName = computed(() => this.authStore.displayName() ?? 'Authority');
  readonly userRole = computed(
    () => this.authStore.authority()?.role ?? (this.authStore.isAdmin() ? 'ADMIN' : 'Officer'),
  );
  readonly isSuperAdmin = this.authStore.isAdmin;

  readonly homeLink = computed(() => (this.isSuperAdmin() ? '/authority' : '/officer'));
  readonly reportsLink = computed(() =>
    this.isSuperAdmin() ? '/authority/reports' : '/officer/reports',
  );
  readonly casesLink = computed(() =>
    this.isSuperAdmin() ? '/authority/case-assignment' : '/officer/cases',
  );
  readonly profileLink = computed(() =>
    this.isSuperAdmin() ? '/authority/officers' : '/officer/profile',
  );

  logout() {
    this.authStore.logout();
    this.router.navigate(['/authority/login']);
  }
}
