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

    // Make Leaflet global for heat plugin
    (window as any).L = this.L;

    // Load heat plugin
    await import('leaflet.heat');

    // 🇵🇰 Pakistan-focused professional setup
    this.map = this.L.map('map', {
      center: [30.3753, 69.3451],
      zoom: 7,
      minZoom: 7,
      maxZoom: 18,
      worldCopyJump: false,
      maxBounds: this.L.latLngBounds(
        [23.3, 60.5],   // Southwest Pakistan
        [37.6, 77.8]    // Northeast Pakistan
      ),
      maxBoundsViscosity: 1.0
    });

    // Standard OpenStreetMap tiles (lively like your mini-map)
    this.L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19 }
    ).addTo(this.map);

    // 🔥 Load dynamic backend hotspots
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

      // Fly but stay within Pakistan bounds
      this.map.flyTo([lat, lon], 12);

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

      if (!data || data.length === 0) {
        console.log('No hotspot data found');
        return;
      }

      const heatPoints = data
        .filter((point: any) => point.latitude && point.longitude)
        .map((point: any) => [
          point.latitude,
          point.longitude,
          0.8
        ]);

      if (heatPoints.length === 0) {
        console.log('No valid coordinates found');
        return;
      }

      (this.L as any).heatLayer(heatPoints, {
        radius: 40,
        blur: 35,
        maxZoom: 17,
        gradient: {
          0.2: '#ffeda0',
          0.4: '#feb24c',
          0.6: '#fd8d3c',
          0.8: '#f03b20',
          1.0: '#bd0026'
        }
      }).addTo(this.map);

    } catch (error) {
      console.error('Failed to load hotspots:', error);
    }
  }
}