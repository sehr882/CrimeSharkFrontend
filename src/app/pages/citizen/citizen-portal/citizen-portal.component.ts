import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service'; // ✅ backend service
import { AiService } from '@app/services/ai.service';

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
    private aiService: AiService
  ) { }
  visibleCount = 4;

  aiLocation = '';
  aiResult: any = null;

  checkSafety() {

    if (!this.aiLocation.trim()) {
      alert('Enter location');
      return;
    }

    this.aiService.checkSafety(this.aiLocation)
      .subscribe({
        next: (res) => {
          this.aiResult = res;
        },
        error: (err) => {
          console.error(err);
          alert('AI service not working');
        }
      });
  }
  goToLiveMap() {
    this.router.navigate(['/citizen/live-map']);
  }

  ngOnInit() {
    this.fetchCrimes();
  }

  goToReport() {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        this.router.navigate(['/citizen/report']);
      } else {
        this.router.navigate(['/citizen/auth']);
      }
    }
  }

  search = '';
  selectedCategory = '';

  categories = ['Moving', 'Static'];

  alerts: Alert[] = [];
  loading = true;

  ngAfterViewInit() {
    this.initMiniMap();
  }

  miniMap: any;

  initMiniMap() {

    const islamabad = { lat: 33.6844, lng: 73.0479 };

    this.miniMap = new google.maps.Map(
      document.getElementById("mini-map") as HTMLElement,
      {
        center: islamabad,
        zoom: 12,
        disableDefaultUI: true
      }
    );

    const hotzones = [
      { lat: 33.7000, lng: 73.0500, radius: 400 },
      { lat: 33.6900, lng: 73.0400, radius: 300 },
      { lat: 33.7100, lng: 73.0600, radius: 350 },
      { lat: 33.6700, lng: 73.0400, radius: 300 },
      { lat: 33.6500, lng: 73.0800, radius: 320 },
      { lat: 33.7200, lng: 73.0300, radius: 280 },
      { lat: 33.6900, lng: 73.0700, radius: 320 },
      { lat: 33.6800, lng: 73.0200, radius: 350 },
      { lat: 33.7050, lng: 73.0900, radius: 380 },
      { lat: 33.6600, lng: 73.0250, radius: 450 }
    ];

    hotzones.forEach(z => {

      new google.maps.Circle({
        strokeColor: "#ff0000",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "#ff0000",
        fillOpacity: 0.35,
        map: this.miniMap,
        center: {
          lat: z.lat,
          lng: z.lng
        },
        radius: z.radius
      });

    });

  }

  fetchCrimes() {
    this.loading = true;
    this.crimeService.getAllCrimes().subscribe({
      next: (data: any) => {
        this.alerts = data.map((crime: any) => ({
          id: crime._id,
          title: crime.crimeTitle,
          subtitle: crime.crimeType + ' - Reported',
          location: crime.location,
          time: new Date(crime.createdAt).toLocaleString(),
          viewers: Math.floor(Math.random() * 200) + 50, // optional demo
          icon: crime.crimeType === 'theft' ? '🚨' : '🏠',
          description: crime.description,
          type: crime.crimeType?.toLowerCase().trim()
        }));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to fetch crimes', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  setCategory(cat: string) {
    this.selectedCategory = this.selectedCategory === cat ? '' : cat;
  }

  onSearch() { }

  filteredAlerts() {
    let filtered = this.alerts.filter(alert => {
      let matchesCategory = true;

      if (this.selectedCategory === 'Moving') {
        matchesCategory = alert.type?.toLowerCase() === 'moving';
      }
      else if (this.selectedCategory === 'Static') {
        matchesCategory = alert.type?.toLowerCase() === 'static';
      }

      const matchesSearch = this.search
        ? alert.title.toLowerCase().includes(this.search.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    });

    return filtered.slice(0, this.visibleCount);
  }
  showMore() {
    this.visibleCount += 4;
  }
}