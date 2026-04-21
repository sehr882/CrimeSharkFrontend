import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthorityNavbarComponent } from '../../shared/authority-navbar/authority-navbar.component';


@Component({
  selector: 'app-authority-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AuthorityNavbarComponent],
  templateUrl: './authority-layout.component.html',
  styleUrls: ['./authority-layout.component.scss']
})
export class AuthorityLayoutComponent {}
