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

  crimeType = "";
  selectedCrime = "";

  staticCrimes = [
    "Burglary", "Robbery (moving)", "Arson", "Vandalism", "Trespassing",
    "Shoplifting", "Embezzlement", "Forgery", "Counterfeiting", "Extortion"
  ];

  movingCrimes = [
    "Pickpocketing", "Snatching", "Mugging", "Vehicle theft", "Street racing",
    "Hit-and-run", "Reckless driving", "Speeding", "DUI", "Robbery (static)"
  ];

  crimeOptions: string[] = [];

  updateCrimeOptions() {
    this.crimeOptions =
      this.crimeType === "static" ? this.staticCrimes :
      this.crimeType === "moving" ? this.movingCrimes :
      [];
  }
}

