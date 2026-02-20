import { Component } from '@angular/core';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [BackButtonComponent],
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss',
})
export class ReportDetailsComponent {

}
