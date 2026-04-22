import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { ViewChild, ElementRef } from '@angular/core';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from 'src/app/services/crime.service';

declare const google: any;

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent, GoogleMapsModule],
  templateUrl: './live-map.component.html',
  styleUrls: ['./live-map.component.scss']
})
export class LiveMapComponent implements AfterViewInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  map: any;
  marker: any;
  searchQuery = '';

  constructor(private crimeService: CrimeService) {}

  async ngAfterViewInit() {
    const center = { lat: 33.6844, lng: 73.0479 };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      { zoom: 7, center }
    );

    const autocomplete = new google.maps.places.Autocomplete(
      this.searchInput.nativeElement,
      { componentRestrictions: { country: 'pk' } }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const location = place.geometry.location;
      this.map.setCenter(location);
      this.map.setZoom(13);

      if (this.marker) this.marker.setMap(null);

      this.marker = new google.maps.Marker({ map: this.map, position: location });
    });

    this.addHotzones();
  }

  searchLocation() {
    if (!this.searchQuery.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: this.searchQuery + ', Pakistan' },
      (results: any, status: any) => {
        if (status === 'OK' && results.length > 0) {
          const location = results[0].geometry.location;
          this.map.setCenter(location);
          this.map.setZoom(13);

          if (this.marker) this.marker.setMap(null);

          this.marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: this.searchQuery,
          });
        } else {
          alert('Location not found. Try a more specific place.');
        }
      }
    );
  }

  // Uses HttpClient via CrimeService so the AuthInterceptor attaches the JWT
  addHotzones() {
    this.crimeService.getHotspots().subscribe({
      next: (data) => {
        data.forEach((point) => {
          if (!point.latitude || !point.longitude) return;

          new google.maps.Circle({
            strokeColor: '#ff0000',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#ff0000',
            fillOpacity: 0.35,
            map: this.map,
            center: { lat: point.latitude, lng: point.longitude },
            radius: 500,
          });
        });
      },
      error: (err) => console.error('Hotspot loading failed', err),
    });
  }
}
