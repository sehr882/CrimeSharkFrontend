import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LiveAlertsService, PublicCrimeAlert } from '../../services/live-alerts.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-live-alerts',
  standalone: true,
  imports: [CommonModule, RouterModule, TimeAgoPipe, BackButtonComponent],
  templateUrl: './live-alerts.component.html',
  styleUrls: ['./live-alerts.component.scss'],
})
export class LiveAlertsComponent implements OnInit, OnDestroy {
  private readonly liveAlerts = inject(LiveAlertsService);

  readonly alerts = this.liveAlerts.alerts;
  readonly connected = this.liveAlerts.connected;
  readonly hasAlerts = this.liveAlerts.hasAlerts;

  readonly riskCounts = computed(() => {
    const counts = { high: 0, medium: 0, low: 0, unknown: 0 };
    for (const a of this.alerts()) {
      const key = (a.aiRisk ?? 'unknown') as keyof typeof counts;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  });

  ngOnInit(): void {
    this.liveAlerts.connect();
    // Tell the service we're actively viewing — silences the navbar badge
    // and resets the unread baseline to "now".
    this.liveAlerts.setViewing(true);
  }

  ngOnDestroy(): void {
    this.liveAlerts.setViewing(false);
    this.liveAlerts.disconnect();
  }

  trackById(_: number, a: PublicCrimeAlert): string {
    return a.id;
  }

  riskLabel(risk: PublicCrimeAlert['aiRisk']): string {
    if (risk === 'high') return 'High Risk';
    if (risk === 'medium') return 'Medium';
    if (risk === 'low') return 'Low Risk';
    return 'Analyzing';
  }

  confidencePct(c: number | null): string {
    if (c == null) return '';
    return `${Math.round(c * 100)}% confidence`;
  }
}
