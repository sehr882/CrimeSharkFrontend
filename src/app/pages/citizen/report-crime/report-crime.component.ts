import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service';

declare var google: any;

@Component({
  selector: 'app-report-crime',
  standalone: true,
  imports: [FormsModule, CommonModule, BackButtonComponent],
  templateUrl: './report-crime.component.html',
  styleUrls: ['./report-crime.component.scss']
})
export class ReportCrimeComponent implements OnInit, AfterViewInit {

  constructor(
    private crimeService: CrimeService,
    private router: Router
  ) { }

  @ViewChild('crimeLocationInput') crimeLocationInput!: ElementRef;

  isVictim: boolean = false;
  victimPhone: string = '';

  crimeType: string = '';
  selectedCrime = '';
  crimeArea = '';
  description = '';
  uploadedFile?: File | null = null;

  latitude: number | null = null;
  longitude: number | null = null;

  crimeDay: number | null = null;
  crimeMonth: number | null = null;
  crimeYear: number | null = null;

  submitted = false;
  showSuccess = false;
  isLoggedIn = false;

  formErrors: Record<string, string> = {};

  staticCrimes = [
    { en: 'Burglary', ur: 'گھر میں چوری' },
    { en: 'Robbery', ur: 'ڈکیتی' },
    { en: 'Arson', ur: 'آتش زنی' },
    { en: 'Vandalism', ur: 'توڑ پھوڑ' },
    { en: 'Trespassing', ur: 'تجاوز' },
    { en: 'Shoplifting', ur: 'دکان میں چوری' },
    { en: 'Embezzlement', ur: 'خیانت' },
    { en: 'Forgery', ur: 'جعل سازی' },
    { en: 'Counterfeiting', ur: 'جعلی سازی' },
    { en: 'Extortion', ur: 'بھتہ خوری' },
    { en: 'Harassment', ur: 'ہراساں کرنا' },
    { en: 'Violence', ur: 'تشدد' }
  ];

  movingCrimes = [
    { en: 'Pickpocketing', ur: 'جیب تراشی' },
    { en: 'Snatching', ur: 'چھینا جھپٹی' },
    { en: 'Mugging', ur: 'غنڈہ گردی' },
    { en: 'Vehicle Theft', ur: 'گاڑی چوری' },
    { en: 'Street Racing', ur: 'سڑک پر دوڑ' },
    { en: 'Hit-and-Run', ur: 'ٹکر مار کر فرار' },
    { en: 'Reckless Driving', ur: 'بے پرواہ ڈرائیونگ' },
    { en: 'Speeding', ur: 'تیز رفتاری' },
    { en: 'DUI (Driving Under Influence)', ur: 'نشے میں ڈرائیونگ' },
    { en: 'Robbery', ur: 'ڈکیتی' },
    { en: 'Street Harassment', ur: 'سڑک پر ہراساں کرنا' },
    { en: 'Mobile Snatching', ur: 'موبائل چھیننا' }
  ];

  crimeOptions: { en: string; ur: string }[] = [];

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

  ngAfterViewInit() {
    this.initializeAutocomplete();
  }

  initializeAutocomplete() {

    if (!this.crimeLocationInput) return;

    const autocomplete = new google.maps.places.Autocomplete(
      this.crimeLocationInput.nativeElement,
      {
        types: ['geocode'],
        componentRestrictions: { country: 'pk' } // restrict to Pakistan
      }
    );

    autocomplete.addListener('place_changed', () => {

      const place = autocomplete.getPlace();

      if (!place.geometry) return;

      this.crimeArea = place.formatted_address;

      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
    });
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.uploadedFile = input.files?.[0] || null;
  }

  submitReport() {

    this.formErrors = {};

    if (!this.crimeType) {
      this.formErrors['crimeType'] = 'Choose crime type.';
    }

    if (!this.selectedCrime) {
      this.formErrors['selectedCrime'] = 'Choose a crime.';
    }

    if (!this.crimeArea) {
      this.formErrors['crimeArea'] = 'Choose crime area.';
    }

    if (!this.latitude || !this.longitude) {
      this.formErrors['crimeArea'] = 'Please select a location from suggestions.';
    }

    if (!this.crimeDay || !this.crimeMonth || !this.crimeYear) {
      this.formErrors['date'] = 'Please select date (day, month, year).';
    }

    if (this.isVictim && !this.victimPhone) {
      this.formErrors['victimPhone'] =
        'Please provide your phone number so authorities can contact you.';
    }

    if (Object.keys(this.formErrors).length > 0) {
      return;
    }

    const crimeData = {

      crimeType: this.crimeType,
      crimeTitle: this.selectedCrime,
      location: this.crimeArea,
      description: this.description,
      latitude: this.latitude,
      longitude: this.longitude,

      dateOfCrime: `${this.crimeYear}-${this.crimeMonth!
        .toString()
        .padStart(2, '0')}-${this.crimeDay!
          .toString()
          .padStart(2, '0')}`,

      isVictim: this.isVictim,
      victimPhone: this.isVictim ? this.victimPhone : null
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
  }

  resetForm() {

    this.crimeType = '';
    this.selectedCrime = '';
    this.crimeOptions = [];
    this.crimeArea = '';
    this.description = '';
    this.uploadedFile = null;

    this.latitude = null;
    this.longitude = null;

    this.crimeDay = null;
    this.crimeMonth = null;
    this.crimeYear = null;

    this.submitted = false;
    this.showSuccess = false;

    this.isVictim = false;
    this.victimPhone = '';

    this.formErrors = {};
  }
}