import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../state/auth.store';
import { LiveAlertsService } from '../../services/live-alerts.service';

@Component({
  selector: 'app-citizen-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './citizen-navbar.component.html',
  styleUrls: ['./citizen-navbar.component.scss']
})
export class CitizenNavbarComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly liveAlerts = inject(LiveAlertsService);

  readonly isLoggedIn = this.authStore.isCitizen;
  readonly loggedInUsername = computed(
    () => this.authStore.citizen()?.username ?? null,
  );

  // Unread count drives the red badge on the Live Alerts menu item.
  // Service stays connected for the lifetime of the citizen layout, so the
  // badge updates in real time even when the user is on /citizen/report etc.
  readonly unreadCount = this.liveAlerts.unreadCount;

  // Cap the visible number so badge stays single-line at 99+.
  readonly badgeText = computed(() => {
    const n = this.unreadCount();
    if (n <= 0) return '';
    return n > 99 ? '99+' : String(n);
  });

  ngOnInit(): void {
    this.liveAlerts.connect();
  }

  ngOnDestroy(): void {
    this.liveAlerts.disconnect();
  }

  goTomyreports() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/citizen/my-reports']);
    } else {
      this.router.navigate(['/citizen/auth']);
    }
  }

  goToReport() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/citizen/report']);
    } else {
      this.router.navigate(['/citizen/auth']);
    }
  }

  logout() {
    this.authStore.logout();
    this.router.navigate(['/']);
  }
}
