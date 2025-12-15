import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.scss']
})
export class LiveMapComponent implements AfterViewInit {

  private map: any;
  private L: any;              // 👈 Leaflet namespace
  searchQuery = '';
  private searchMarker: any;

  async ngAfterViewInit(): Promise<void> {

    // ✅ SSR / Vite safety guard
    if (typeof window === 'undefined') return;

    // ✅ Dynamically load Leaflet
    const leaflet = await import('leaflet');
    this.L = leaflet;

    // -----------------------------
    // MAP SETUP (UNCHANGED)
    // -----------------------------
    this.map = this.L.map('map').setView([33.6844, 73.0479], 12);

    this.L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(this.map);

    this.addHotzones();
  }

  // ----------------------------------
  // 🔍 SEARCH LOCATION
  // ----------------------------------
  async searchLocation() {
    if (!this.searchQuery.trim()) return;

    const query = encodeURIComponent(this.searchQuery);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    try {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      const results: any[] = await response.json();

      if (!results || results.length === 0) {
        alert('Location not found');
        return;
      }

      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);

      this.map.flyTo([lat, lon], 13);

      if (this.searchMarker) {
        this.map.removeLayer(this.searchMarker);
      }

      const emojiIcon = this.L.divIcon({
        className: 'emoji-marker',
        html: '📍',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      this.searchMarker = this.L.marker([lat, lon], { icon: emojiIcon })
        .addTo(this.map)
        .bindPopup(`📍 ${this.searchQuery}`)
        .openPopup();

    } catch (err) {
      console.error(err);
      alert('Search failed. Try again.');
    }
  }

  // ----------------------------------
  // 🔥 HOTZONES (UNCHANGED)
  // ----------------------------------
  addHotzones() {

    const hotzones = [
      { lat: 33.6938, lng: 73.0652, radius: 500, label: 'High Crime — F-8 Markaz' },
      { lat: 33.6844, lng: 73.0479, radius: 450, label: 'Theft Reports — Blue Area' },
      { lat: 33.6995, lng: 73.0363, radius: 400, label: 'Snatching — G-9' },
      { lat: 33.6725, lng: 73.0572, radius: 350, label: 'Vehicle Theft — I-8' },

      { lat: 33.5951, lng: 73.0479, radius: 550, label: 'Street Crime — Saddar' },
      { lat: 33.6212, lng: 73.0718, radius: 450, label: 'Robbery — Raja Bazaar' },
      { lat: 33.6439, lng: 73.0686, radius: 400, label: 'Burglary — Chandni Chowk' },

      { lat: 31.5204, lng: 74.3587, radius: 500, label: 'Robbery — Gulberg' },
      { lat: 31.4800, lng: 74.3239, radius: 400, label: 'Burglary — Model Town' },

      { lat: 24.8607, lng: 67.0011, radius: 550, label: 'Street Crime — Saddar' },
      { lat: 24.8138, lng: 67.0304, radius: 450, label: 'Snatching — Clifton' }
    ];

    hotzones.forEach(zone => {
      this.L.circle([zone.lat, zone.lng], {
        color: '#ff4d4d',
        fillColor: '#ff4d4d',
        fillOpacity: 0.35,
        radius: zone.radius
      })
      .addTo(this.map)
      .bindPopup(`<strong>${zone.label}</strong>`);
    });
  }
}



