import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.scss']
})
export class LiveMapComponent implements AfterViewInit {

  private map: any;
  private L: any;
  searchQuery = '';
  private searchMarker: any;

  async ngAfterViewInit(): Promise<void> {

  if (typeof window === 'undefined') return;

  const leaflet = await import('leaflet');
  this.L = leaflet;

  // 👇 make Leaflet global for heat plugin
  (window as any).L = this.L;

  // 👇 now load heat plugin
  await import('leaflet.heat');

  this.map = this.L.map('map').setView([30.3753, 69.3451], 6);

  this.L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    { maxZoom: 19 }
  ).addTo(this.map);

  await this.addHotzones();
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
  // 🔥 DYNAMIC HOTZONES (HEATMAP)
  // ----------------------------------
  async addHotzones() {
    try {
      const response = await fetch('http://localhost:3000/crime/hotspots');
      const data = await response.json();
      console.log('HOTSPOTS DATA:', data);

      if (!data || data.length === 0) {
        console.log('No hotspot data found');
        return;
      }

      const heatPoints = data
        .filter((point: any) => point.latitude && point.longitude)
        .map((point: any) => [
          point.latitude,
          point.longitude,
          0.8 // intensity
        ]);

      if (heatPoints.length === 0) {
        console.log('No valid coordinates found');
        return;
      }
    (this.L as any).heatLayer(heatPoints, {
   radius: 35,
   blur: 30,
   maxZoom: 17,
   gradient: {
    0.2: '#ffcccc',
    0.4: '#ff6666',
    0.6: '#ff1a1a',
    0.8: '#cc0000',
    1.0: '#800000'
  }
  }).addTo(this.map);

    } catch (error) {
      console.error('Failed to load hotspots:', error);
    }
  }
}