import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service'; // ✅ backend service

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
export class CitizenPortalComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private crimeService: CrimeService // ✅ inject service
  ) { }

  goToReport() {
    localStorage.setItem('postLoginRedirect', '/report');
    this.router.navigate(['/citizen/auth']);
  }

  search = '';
  selectedCategory = '';

  categories = ['Robbery', 'Burglary', 'Cybercrime', 'Missing Person', 'Assault'];

  alerts: Alert[] = []; // will be filled from backend
  loading = true;

  trending = [
    { title: 'Scam Alert', when: '3 hours ago' },
  ];

  // Leaflet variables
  private L: any;        
  private miniMap: any;  

  async ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    const leaflet = await import('leaflet');
    this.L = leaflet;
    this.initMiniMap();
  }

  initMiniMap() {
    this.miniMap = this.L.map('mini-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([33.6844, 73.0479], 12);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3
    }).addTo(this.miniMap);

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
      this.L.circle([z.lat, z.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
        radius: z.radius
      }).addTo(this.miniMap);
    });

    // Fetch crimes after map is ready
    this.fetchCrimes();
  }

  // ---------------------------------------------------
  // Fetch crimes from backend
  // ---------------------------------------------------
  fetchCrimes() {
    this.loading = true;
    this.crimeService.getAllCrimes().subscribe({
      next: (data) => {
        // Map backend data to Alert interface
        this.alerts = data.map(crime => ({
          id: crime._id,
          title: crime.title,
          subtitle: crime.type + ' - Reported',
          location: crime.area,
          time: new Date(crime.createdAt).toLocaleString(),
          viewers: Math.floor(Math.random() * 200) + 50, // optional demo
          icon: crime.type === 'static' ? '🏠' : '🚨',
          description: crime.description,
          type: crime.type
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch crimes', err);
        this.loading = false;
      }
    });
  }

  setCategory(cat: string) {
    this.selectedCategory = this.selectedCategory === cat ? '' : cat;
  }

  onSearch() { }

  filteredAlerts() {
    return this.alerts.filter(alert => {
      const matchesCategory = this.selectedCategory
        ? alert.title.toLowerCase().includes(this.selectedCategory.toLowerCase())
        : true;

      const matchesSearch = this.search
        ? alert.title.toLowerCase().includes(this.search.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    });
  }
}