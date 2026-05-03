import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  computed,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

export interface PublicCrimeAlert {
  id: string;
  crimeType: string;
  crimeTitle: string;
  area: string;
  city: string;
  approxLat: number;
  approxLng: number;
  dateOfCrime: string;
  timeOfCrime?: string | null;
  reportedAt: string;
  aiRisk: 'low' | 'medium' | 'high' | 'unknown' | null;
  aiConfidence: number | null;
  aiAnalysis: string | null;
}

// Hard cap on what we keep in memory — prevents unbounded growth on a long-
// open viewer session. Older alerts drop off the bottom as new ones arrive.
const MAX_ALERTS = 100;

// Public, unauthenticated live feed. Anyone can connect; the backend strips
// PII at the boundary so this stream is safe to render on a public page.
@Injectable({ providedIn: 'root' })
export class LiveAlertsService implements OnDestroy {
  private socket: Socket | null = null;
  private readonly state = signal<PublicCrimeAlert[]>([]);
  private readonly connectedSig = signal(false);
  private subscribers = 0;

  // Tracks when the user last "looked at" the live feed. Anything that arrives
  // after this point counts as unread until the user visits the page again.
  // Initialised to construction time so the seed list never appears as unread.
  private readonly lastSeenAt = signal<number>(Date.now());
  private readonly viewing = signal(false);

  readonly alerts = computed(() => this.state());
  readonly connected = computed(() => this.connectedSig());
  readonly hasAlerts = computed(() => this.state().length > 0);

  // Zero while the user is actively on the Live Alerts page; otherwise the
  // number of alerts received since they last looked. Capped at 99+ visually
  // by the navbar template, but the real count is preserved here.
  readonly unreadCount = computed(() => {
    if (this.viewing()) return 0;
    const cutoff = this.lastSeenAt();
    return this.state().filter(a => {
      const t = new Date(a.reportedAt).getTime();
      return Number.isFinite(t) && t > cutoff;
    }).length;
  });

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnDestroy(): void {
    this.disconnect();
  }

  // Idempotent: multiple components can call connect()/disconnect() and
  // the socket stays open as long as at least one of them is alive.
  connect() {
    this.subscribers++;
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.socket) return;

    this.fetchInitial();

    const url = `${environment.apiUrl}/live-alerts`;
    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => this.connectedSig.set(true));
    this.socket.on('disconnect', () => this.connectedSig.set(false));

    this.socket.on('crime:new', (alert: PublicCrimeAlert) => {
      this.state.update((current) => {
        // Dedupe by id — repeat broadcasts (e.g. from a reconnect) shouldn't double up.
        if (current.some((a) => a.id === alert.id)) return current;
        return [alert, ...current].slice(0, MAX_ALERTS);
      });
    });

    this.socket.on('crime:remove', (payload: { id: string }) => {
      this.state.update((current) => current.filter((a) => a.id !== payload.id));
    });
  }

  disconnect() {
    this.subscribers = Math.max(0, this.subscribers - 1);
    if (this.subscribers > 0) return;
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectedSig.set(false);
  }

  // Called by LiveAlertsComponent on enter/leave so the badge silences itself
  // while the user is staring at the feed.
  setViewing(v: boolean) {
    this.viewing.set(v);
    if (v) this.markAllSeen();
  }

  markAllSeen() {
    this.lastSeenAt.set(Date.now());
  }

  private fetchInitial() {
    this.fetchSeed().subscribe({
      next: (items) => this.state.set((items ?? []).slice(0, MAX_ALERTS)),
      error: () => this.state.set([]),
    });
  }

  private fetchSeed(): Observable<PublicCrimeAlert[]> {
    return this.http.get<PublicCrimeAlert[]>(`${environment.apiUrl}/crime/public/live`);
  }
}
