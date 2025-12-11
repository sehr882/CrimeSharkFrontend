import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-crime',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './report-crime.component.html',
  styleUrls: ['./report-crime.component.scss']
})
export class ReportCrimeComponent {

  crimeType = '';
  selectedCrime = '';
  crimeArea = '';
  description = '';
  uploadedFile?: File | null = null;

  staticCrimes = [
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

  movingCrimes = [
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

  updateCrimeOptions() {
    // reset selectedCrime whenever type changes
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
    if (input.files && input.files.length) {
      this.uploadedFile = input.files[0];
    } else {
      this.uploadedFile = null;
    }
  }

  submitReport() {
    // basic client-side validation
    if (!this.crimeType) {
      alert('Please select a crime type.');
      return;
    }
    if (!this.selectedCrime) {
      alert('Please select a crime.');
      return;
    }
    // build payload example
    const payload = {
      type: this.crimeType,
      crime: this.selectedCrime,
      description: this.description,
      fileName: this.uploadedFile?.name ?? null,
      timestamp: new Date().toISOString()
    };
    console.log('Submitting report:', payload);
    // TODO: send payload + file to backend service
    alert('Report submitted (demo). Check console for payload.');
    // reset form (optional)
    this.crimeType = '';
    this.selectedCrime = '';
    this.crimeOptions = [];
    this.description = '';
    this.uploadedFile = null;
  }
}



