import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { CrimeService } from '@app/services/crime.service'; // ✅ your service

@Component({
  selector: 'app-report-crime',
  standalone: true,
  imports: [FormsModule, CommonModule, BackButtonComponent],
  templateUrl: './report-crime.component.html',
  styleUrls: ['./report-crime.component.scss']
})
export class ReportCrimeComponent implements OnInit {

  constructor(private crimeService: CrimeService) {
    console.log('[REPORT-COMP] constructor');
  }

  crimeType: string = '';
  selectedCrime = '';
  crimeArea = '';
  description = '';
  uploadedFile?: File | null = null;

  submitted = false;
  showSuccess = false;

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
    console.log('[REPORT-COMP] ngOnInit - initial crimeType:', this.crimeType);
    this.updateCrimeOptions();
  }

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
    if (!this.crimeArea) { alert('Choose crime area'); return; }

    const crimeData = {
      title: this.selectedCrime,
      description: this.description,
      area: this.crimeArea,
      type: this.crimeType
    };

    this.crimeService.reportCrime(crimeData, this.uploadedFile).subscribe({
      next: res => {
        alert(res.message || 'Crime reported successfully!');
        this.resetForm();
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
    this.submitted = false;
    this.showSuccess = false;
  }
}