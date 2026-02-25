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
  ) { }

  crimeType: string = '';
  selectedCrime = '';
  crimeArea = '';
  description = '';
  uploadedFile?: File | null = null;

  // ✅ Date Fields
  crimeDay: number | null = null;
  crimeMonth: number | null = null;
  crimeYear: number | null = null;

  // ✅ Map + Suggestions
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

    // Pakistan restricted search
    fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=pk&q=${this.crimeArea}`)
      .then(res => res.json())
      .then(data => {

        this.locationSuggestions = data.slice(0, 5).map((place: any) => {

          // Clean name formatting
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

    // Put clean name inside input
    this.crimeArea = place.name;

    // Clear suggestions
    this.locationSuggestions = [];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.uploadedFile = input.files?.[0] || null;
  }

  submitReport() {

    // ✅ Required Validations
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

    // ✅ Basic Date Validation
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

    const crimeData = {
      title: this.selectedCrime,
      description: this.description,
      area: this.crimeArea,
      type: this.crimeType,
      dateOfCrime:`${this.crimeYear}-${this.crimeMonth.toString().padStart(2, '0')}-${this.crimeDay.toString().padStart(2, '0')}`
    };

    this.crimeService.reportCrime(crimeData, this.uploadedFile).subscribe({
      next: res => {
        alert(res.message || 'Crime reported successfully!');
        this.resetForm();
        this.router.navigate(['/citizen']);
      },
      error: err => {
        alert(err.error?.message || 'Failed to report crime');
        console.error(err);
      }
    });
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