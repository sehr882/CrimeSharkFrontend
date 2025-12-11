import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-crime',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report-crime.component.html',
  styleUrls: ['./report-crime.component.scss']
})
export class ReportCrimeComponent implements OnInit {

  // Logs help us verify this exact runtime class is loaded
  constructor() {
    console.log('[REPORT-COMP] constructor');
  }

  crimeType: string = '';       // start empty to match your preference
  selectedCrime = '';
  crimeArea = '';
  description = '';
  uploadedFile?: File | null = null;

  staticCrimes: string[] = [
    "Burglary",
    "Robbery (moving)",
    "Arson",
    "Vandalism",
    "Trespassing",
    "Shoplifting",
    "Embezzlement",
    "Forgery",
    "Counterfeiting",
    "Extortion"
  ];

  movingCrimes: string[] = [
    "Pickpocketing",
    "Snatching",
    "Mugging",
    "Vehicle theft",
    "Street racing",
    "Hit-and-run",
    "Reckless driving",
    "Speeding",
    "DUI (Driving Under Influence)",
    "Robbery (static)"
  ];

  crimeOptions: string[] = [];

  ngOnInit() {
    console.log('[REPORT-COMP] ngOnInit - initial crimeType:', this.crimeType);
    // do NOT auto-select — but ensure the function exists and logs when called
    this.updateCrimeOptions(); // will populate if crimeType non-empty (mostly logs)
  }

  // called both on (ngModelChange) and can be called manually
  updateCrimeOptions(): void {
    console.log('[REPORT-COMP] updateCrimeOptions() called — crimeType=', this.crimeType);
    this.selectedCrime = '';

    if (this.crimeType === 'static') {
      this.crimeOptions = [...this.staticCrimes];
    } else if (this.crimeType === 'moving') {
      this.crimeOptions = [...this.movingCrimes];
    } else {
      this.crimeOptions = [];
    }

    console.log('[REPORT-COMP] crimeOptions =>', this.crimeOptions);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.uploadedFile = input.files?.[0] || null;
    console.log('[REPORT-COMP] onFileSelected', this.uploadedFile);
  }

  submitReport() {
    console.log('[REPORT-COMP] submitReport called', {
      crimeType: this.crimeType,
      selectedCrime: this.selectedCrime,
      crimeArea: this.crimeArea,
      description: this.description,
      file: this.uploadedFile
    });

    if (!this.crimeType) { alert('Choose crime type'); return; }
    if (!this.selectedCrime) { alert('Choose a crime'); return; }

    // reset for demo
    this.crimeType = '';
    this.selectedCrime = '';
    this.crimeOptions = [];
    this.crimeArea = '';
    this.description = '';
    this.uploadedFile = null;
  }
}





