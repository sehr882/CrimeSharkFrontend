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
    this.map = L.map('map').setView([33.6844, 73.0479], 13); // Rawalpindi/Islamabad

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    // Example Hotzones
    L.circle([33.7000, 73.0500], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.3,
      radius: 400
    }).addTo(this.map).bindPopup("Hotzone: High Crime Area");

    L.circle([33.6900, 73.0400], {
      color: 'orange',
      fillColor: '#f90',
      fillOpacity: 0.3,
      radius: 300
    }).addTo(this.map).bindPopup("Hotzone: Medium Crime Area");
  }
}
