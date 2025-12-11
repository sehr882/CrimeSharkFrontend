import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-live-map',
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.scss']
})
export class LiveMapComponent implements AfterViewInit {

  private map: any;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([33.6844, 73.0479], 13); // Islamabad/Rawalpindi

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    // ---------------------------
    // 🔥 LIST OF MULTIPLE HOTZONES
    // ---------------------------
    const hotzones = [
      { lat: 33.7000, lng: 73.0500, radius: 400, label: "High Crime Area" },  // F-8
      { lat: 33.6900, lng: 73.0400, radius: 300, label: "Medium Crime Area" }, // F-7
      { lat: 33.7100, lng: 73.0600, radius: 350, label: "High Alert Zone" },   // F-10
      { lat: 33.6700, lng: 73.0400, radius: 300, label: "Suspicious Activity" }, // Blue Area
      { lat: 33.6500, lng: 73.0800, radius: 320, label: "Reported Theft Zone" }, // I-8
      { lat: 33.7200, lng: 73.0300, radius: 280, label: "Frequent Police Reports" }, // G-11
      { lat: 33.6900, lng: 73.0700, radius: 320, label: "Night Crime Hotspot" }, // F-6
      { lat: 33.6800, lng: 73.0200, radius: 350, label: "High Traffic & Risk Area" }, // G-6
    ];

    // Add hotzones to the map
    hotzones.forEach(zone => {
      L.circle([zone.lat, zone.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
        radius: zone.radius
      }).addTo(this.map)
        .bindPopup(`Hotzone: ${zone.label}`);
    });
  }
}

