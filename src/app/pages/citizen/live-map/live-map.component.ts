import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { ViewChild, ElementRef } from '@angular/core';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

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

  async ngAfterViewInit() {

    const center = { lat: 33.6844, lng: 73.0479 };

    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 7,
        center: center
      }
    );

    const autocomplete = new google.maps.places.Autocomplete(
      this.searchInput.nativeElement,
      {
        componentRestrictions: { country: "pk" }
      }
    );

    autocomplete.addListener("place_changed", () => {

      const place = autocomplete.getPlace();

      if (!place.geometry) return;

      const location = place.geometry.location;

      this.map.setCenter(location);
      this.map.setZoom(13);

      if (this.marker) {
        this.marker.setMap(null);
      }

      this.marker = new google.maps.Marker({
        map: this.map,
        position: location
      });

    });
    this.addHotzones();
  }

  // 🔎 SEARCH LOCATION
  searchLocation() {

    if (!this.searchQuery.trim()) return;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      {
        address: this.searchQuery + ", Pakistan"
      },
      (results: any, status: any) => {

        if (status === "OK" && results.length > 0) {

          const location = results[0].geometry.location;

          this.map.setCenter(location);
          this.map.setZoom(13);

          if (this.marker) {
            this.marker.setMap(null);
          }

          this.marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: this.searchQuery
          });

        } else {
          console.log("Geocoder status:", status);
          alert("Location not found. Try a more specific place.");
        }

      }
    );
  }

  // 🔥 HOTSPOTS FROM BACKEND
  async addHotzones() {

    try {

      const response = await fetch('http://localhost:3000/crime/hotspots');
      const data = await response.json();

      data.forEach((point: any) => {

        if (!point.latitude || !point.longitude) return;

        new google.maps.Circle({
          strokeColor: "#ff0000",
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: "#ff0000",
          fillOpacity: 0.35,
          map: this.map,
          center: {
            lat: point.latitude,
            lng: point.longitude
          },
          radius: 500
        });

      });

    } catch (error) {
      console.error("Hotspot loading failed", error);
    }

  }

}