import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service';

@Component({
  selector: 'app-report-crime',
  standalone: true,
  imports: [FormsModule, CommonModule, BackButtonComponent],
  templateUrl: './report-crime.component.html',
  styleUrls: ['./report-crime.component.scss']
})
export class ReportCrimeComponent implements OnInit {

  constructor(
    private crimeService: CrimeService,
    private router: Router
  ) {}

  crimeType: string = '';
  selectedCrime = '';
  crimeArea = '';
  description = '';
  uploadedFile?: File | null = null;

  // Date Fields
  crimeDay: number | null = null;
  crimeMonth: number | null = null;
  crimeYear: number | null = null;

  locationSuggestions: any[] = [];

  submitted = false;
  showSuccess = false;
  isLoggedIn = false;

  staticCrimes: string[] = [
    "Burglary", "Robbery (static)", "Arson", "Vandalism",
    "Trespassing", "Shoplifting", "Embezzlement", "Forgery",
    "Counterfeiting", "Extortion"
  ];

  movingCrimes: string[] = [
    "Pickpocketing", "Snatching", "Mugging", "Vehicle theft",
    "Street racing", "Hit-and-run", "Reckless driving",
    "Speeding", "DUI (Driving Under Influence)", "Robbery (moving)"
  ];

  crimeOptions: string[] = [];

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!this.isLoggedIn) {
        alert('You must be logged in to report a crime');
        this.router.navigate(['/citizen/auth']);
        return;
      }
    }

    this.updateCrimeOptions();
  }

  updateCrimeOptions(): void {
    this.selectedCrime = '';

    if (this.crimeType === 'static') {
      this.crimeOptions = [...this.staticCrimes];
    } else if (this.crimeType === 'moving') {
      this.crimeOptions = [...this.movingCrimes];
    } else {
      this.crimeOptions = [];
    }
  }

  searchLocation() {
    if (!this.crimeArea || this.crimeArea.length < 3) {
      this.locationSuggestions = [];
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=pk&q=${this.crimeArea}`)
      .then(res => res.json())
      .then(data => {
        this.locationSuggestions = data.slice(0, 5).map((place: any) => {
          const parts = place.display_name.split(',');
          return {
            name: `${parts[0]}, ${parts[1] || ''}`.trim(),
            fullName: place.display_name
          };
        });
      })
      .catch(() => {
        this.locationSuggestions = [];
      });
  }

  selectLocation(place: any) {
    this.crimeArea = place.name;
    this.locationSuggestions = [];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.uploadedFile = input.files?.[0] || null;
  }

  async submitReport() {

    if (!this.crimeType) {
      alert('Choose crime type');
      return;
    }

    if (!this.selectedCrime) {
      alert('Choose a crime');
      return;
    }

    if (!this.crimeArea) {
      alert('Choose crime area');
      return;
    }

    if (!this.crimeDay || !this.crimeMonth || !this.crimeYear) {
      alert('Please select date (day, month, year)');
      return;
    }

    if (this.crimeDay < 1 || this.crimeDay > 31) {
      alert('Invalid day');
      return;
    }

    if (this.crimeMonth < 1 || this.crimeMonth > 12) {
      alert('Invalid month');
      return;
    }

    if (this.crimeYear < 1900 || this.crimeYear > new Date().getFullYear()) {
      alert('Invalid year');
      return;
    }

    try {
      // Convert location text → lat/lon
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=pk&q=${encodeURIComponent(this.crimeArea)}`
      );

      const geoData: any[] = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        alert('Could not determine coordinates for this location.');
        return;
      }

      const latitude = parseFloat(geoData[0].lat);
      const longitude = parseFloat(geoData[0].lon);

      const crimeData = {
        crimeType: this.crimeType,
        crimeTitle: this.selectedCrime,
        location: this.crimeArea,
        description: this.description,
        latitude: latitude,
        longitude: longitude,
        dateOfCrime: `${this.crimeYear}-${this.crimeMonth
          .toString()
          .padStart(2, '0')}-${this.crimeDay
          .toString()
          .padStart(2, '0')}`
      };

      this.crimeService.reportCrime(crimeData, this.uploadedFile).subscribe({
        next: (res: any) => {
          alert(res?.message || 'Crime reported successfully!');
          this.resetForm();
          this.router.navigate(['/citizen']);
        },
        error: (err) => {
          alert(err?.error?.message || 'Failed to report crime');
          console.error(err);
        }
      });

    } catch (error) {
      console.error(error);
      alert('Failed to fetch location coordinates.');
    }
  }

  resetForm() {
    this.crimeType = '';
    this.selectedCrime = '';
    this.crimeOptions = [];
    this.crimeArea = '';
    this.description = '';
    this.uploadedFile = null;
    this.crimeDay = null;
    this.crimeMonth = null;
    this.crimeYear = null;
    this.submitted = false;
    this.showSuccess = false;
  }
}