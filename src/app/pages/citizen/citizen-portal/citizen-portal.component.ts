import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service';

declare const google: any;

interface Alert {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  time: string;
  viewers?: number;
  icon?: string;
  description?: string;
  type?: string;
}

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

  goToReport(): void {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      this.router.navigate([isLoggedIn ? '/citizen/report' : '/citizen/auth']);
    }
  }

  // ── Crime feed ──────────────────────────────────────────────────────────────
  visibleCount = 4;
  search = '';
  selectedCategory = '';
  categories = ['Moving', 'Static'];
  alerts: Alert[] = [];
  loading = true;

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
            strokeColor: '#ff0000',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#ff0000',
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
        this.alerts = data.map((crime: any) => ({
          id: crime._id,
          title: crime.crimeTitle,
          subtitle: crime.crimeType + ' - Reported',
          location: crime.location,
          time: new Date(crime.createdAt).toLocaleString(),
          viewers: Math.floor(Math.random() * 200) + 50,
          icon: crime.crimeType === 'theft' ? '🚨' : '🏠',
          description: crime.description,
          type: crime.crimeType?.toLowerCase().trim()
        }));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  setCategory(cat: string): void {
    this.selectedCategory = this.selectedCategory === cat ? '' : cat;
  }

  onSearch(): void {}

  filteredAlerts(): Alert[] {
    return this.alerts
      .filter(alert => {
        const matchesCategory =
          !this.selectedCategory ||
          alert.type?.toLowerCase() === this.selectedCategory.toLowerCase();
        const matchesSearch = !this.search ||
          alert.title.toLowerCase().includes(this.search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .slice(0, this.visibleCount);
  }

  showMore(): void {
    this.visibleCount += 4;
  }
}
