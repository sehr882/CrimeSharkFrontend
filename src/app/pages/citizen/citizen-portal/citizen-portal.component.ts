import { Component, AfterViewInit, OnInit, ChangeDetectorRef, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service';

declare const google: any;

// Major Pakistani cities scanned for in the raw `location` string.
// Locations in the DB are messy ("G-13/4 G 13/4 G-13, Pakistan"); a literal
// last-segment split returns "Pakistan" for every row, which is useless as a
// filter. This list lets us tag rows with a real city when one is mentioned
// anywhere in the location text.
const PK_CITIES: ReadonlyArray<string> = [
  'Islamabad',
  'Rawalpindi',
  'Lahore',
  'Karachi',
  'Peshawar',
  'Quetta',
  'Multan',
  'Faisalabad',
  'Sialkot',
  'Hyderabad',
  'Gujranwala',
];

function extractCity(location: string): string {
  if (!location) return 'Unknown';
  const lower = location.toLowerCase();
  for (const city of PK_CITIES) {
    if (lower.includes(city.toLowerCase())) return city;
  }
  // Fallback: use the segment before the country tag.
  const segments = location.split(',').map(s => s.trim()).filter(Boolean);
  if (segments.length >= 2 && segments[segments.length - 1].toLowerCase() === 'pakistan') {
    return segments[segments.length - 2];
  }
  return segments[segments.length - 1] ?? 'Unknown';
}

interface Alert {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  city: string;
  createdAt: number; // epoch ms — used for sort
  time: string;
  type?: string;
  description?: string;
}

const PAGE_SIZE = 5;

@Component({
  selector: 'app-citizen-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButtonComponent],
  templateUrl: './citizen-portal.component.html',
  styleUrls: ['./citizen-portal.component.scss']
})
export class CitizenPortalComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private crimeService: CrimeService,
    private cdr: ChangeDetectorRef,
  ) {}

  // ── Navigation ──────────────────────────────────────────────────────────────
  goToLiveMap(): void {
    this.router.navigate(['/citizen/live-map']);
  }

  // ── Crime feed state ────────────────────────────────────────────────────────
  // Signals so the template stays purely reactive — sort once on load,
  // filter + paginate are computed from search/city/page signals.
  readonly alerts = signal<Alert[]>([]);
  readonly search = signal('');
  readonly selectedCity = signal<string>(''); // '' means All
  readonly page = signal(0);
  loading = true;

  // Up to 8 cities derived from the data — keeps the filter row scannable.
  readonly cities = computed<string[]>(() => {
    const set = new Set<string>();
    for (const a of this.alerts()) {
      if (a.city) set.add(a.city);
    }
    return Array.from(set).sort().slice(0, 8);
  });

  readonly filteredAlerts = computed<Alert[]>(() => {
    const term = this.search().trim().toLowerCase();
    const city = this.selectedCity();
    return this.alerts().filter(a => {
      if (city && a.city !== city) return false;
      if (!term) return true;
      return (
        a.title.toLowerCase().includes(term) ||
        a.location.toLowerCase().includes(term) ||
        (a.type ?? '').toLowerCase().includes(term)
      );
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredAlerts().length / PAGE_SIZE)),
  );

  readonly pagedAlerts = computed<Alert[]>(() => {
    const start = this.page() * PAGE_SIZE;
    return this.filteredAlerts().slice(start, start + PAGE_SIZE);
  });

  ngOnInit(): void {
    this.fetchCrimes();
  }

  ngAfterViewInit(): void {
    this.initMiniMap();
  }

  miniMap: any;

  initMiniMap(): void {
    const islamabad = { lat: 33.6844, lng: 73.0479 };
    this.miniMap = new google.maps.Map(
      document.getElementById('mini-map') as HTMLElement,
      { center: islamabad, zoom: 12, disableDefaultUI: true }
    );

    this.crimeService.getHotspots().subscribe({
      next: (points) => {
        points.forEach((point) => {
          if (!point.latitude || !point.longitude) return;
          new google.maps.Circle({
            strokeColor: '#dc2626',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#ef4444',
            fillOpacity: 0.35,
            map: this.miniMap,
            center: { lat: point.latitude, lng: point.longitude },
            radius: 500,
          });
        });
      },
      error: () => {},
    });
  }

  fetchCrimes(): void {
    this.loading = true;
    this.crimeService.getAllCrimes().subscribe({
      next: (data: any) => {
        const mapped: Alert[] = (data ?? []).map((crime: any) => {
          const created = crime.createdAt
            ? new Date(crime.createdAt).getTime()
            : 0;
          const city = extractCity(crime.location ?? '');
          return {
            id: crime._id,
            title: crime.crimeTitle ?? 'Untitled',
            subtitle: `${crime.crimeType ?? 'Report'} · Reported`,
            location: crime.location ?? '',
            city,
            createdAt: created,
            time: created ? new Date(created).toLocaleString() : '',
            type: crime.crimeType?.toLowerCase().trim(),
            description: crime.description,
          };
        });

        // Newest first.
        mapped.sort((a, b) => b.createdAt - a.createdAt);

        this.alerts.set(mapped);
        this.page.set(0);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ── Filter / pagination actions ─────────────────────────────────────────────
  setCity(city: string): void {
    this.selectedCity.set(this.selectedCity() === city ? '' : city);
    this.page.set(0);
  }

  onSearchInput(value: string): void {
    this.search.set(value);
    this.page.set(0);
  }

  prevPage(): void {
    this.page.update(p => Math.max(0, p - 1));
  }

  nextPage(): void {
    this.page.update(p => Math.min(this.totalPages() - 1, p + 1));
  }

  trackById(_: number, a: Alert): string {
    return a.id;
  }
}
