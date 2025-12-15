import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Alert {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  time: string;
  viewers: number;
  icon: string;
}

@Component({
  selector: 'app-citizen-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './citizen-portal.component.html',
  styleUrls: ['./citizen-portal.component.scss']
})
export class CitizenPortalComponent implements AfterViewInit {

  search = '';
  selectedCategory = '';

  categories = ['Robbery', 'Burglary', 'Cybercrime', 'Missing Person', 'Assault'];

  alerts: Alert[] = [
  {
    id: 1,
    title: 'Robbery in Model Town',
    subtitle: 'Reported 15 mins ago',
    location: 'Lahore',
    time: '15 mins',
    viewers: 250,
    icon: '🔴',
  },
  {
    id: 2,
    title: 'Burglary in Gulberg',
    subtitle: '1 hour ago - Verified',
    location: 'Lahore',
    time: '1 hour',
    viewers: 170,
    icon: '🏠',
  },
  {
    id: 3,
    title: 'Assault in Saddar',
    subtitle: '2 hours ago',
    location: 'Karachi',
    time: '2 hours',
    viewers: 140,
    icon: '⚠️',
  },
  {
    id: 4,
    title: 'Cybercrime Scam Reported',
    subtitle: 'Online fraud case',
    location: 'Islamabad',
    time: '3 hours',
    viewers: 95,
    icon: '💻',
  },
  {
    id: 5,
    title: 'Robbery Attempt Foiled',
    subtitle: 'Suspect fled the scene',
    location: 'Rawalpindi',
    time: '30 mins',
    viewers: 110,
    icon: '🚨',
  },
  {
    id: 6,
    title: 'Burglary at Electronics Shop',
    subtitle: 'CCTV footage under review',
    location: 'Lahore',
    time: '4 hours',
    viewers: 200,
    icon: '🏪',
  }
];


  trending = [
    { title: 'Scam Alert', when: '3 hours ago' },
  ];

  // ⭐ Leaflet variables
  private L: any;        // Leaflet Namespace
  private miniMap: any;  // Mini-map instance

  // ---------------------------------------------------
  // ⭐ After view loads, initialize map
  // ---------------------------------------------------
  async ngAfterViewInit() {

    // IMPORTANT: Prevent Angular Universal SSR crash
    if (typeof window === 'undefined') return;

    // Load Leaflet dynamically (fixes SSR + TS errors)
    const leaflet = await import('leaflet');
    this.L = leaflet;

    this.initMiniMap();
  }

  // ---------------------------------------------------
  // ⭐ MINI MAP INITIALIZER
  // ---------------------------------------------------
  initMiniMap() {

    this.miniMap = this.L.map('mini-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([33.6844, 73.0479], 12);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3
    }).addTo(this.miniMap);

    // More hotzones added ⭐
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
  }

  // ---------------------------------------------------
  // CATEGORY FILTERING
  // ---------------------------------------------------
  setCategory(cat: string) {
    this.selectedCategory = this.selectedCategory === cat ? '' : cat;
  }
  onSearch() {}

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

