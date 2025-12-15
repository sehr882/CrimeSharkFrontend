import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CitizenNavbarComponent } from '../../shared/citizen-navbar/citizen-navbar.component';

@Component({
  selector: 'app-citizen-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CitizenNavbarComponent   // ✅ THIS FIXES THE ERROR
  ],
  templateUrl: './citizen-layout.component.html',
  styleUrls: ['./citizen-layout.component.scss']
})
export class CitizenLayoutComponent {}


