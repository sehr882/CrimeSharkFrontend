import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Alert {
  id: number;
  title: string;
  subtitle?: string;
  location: string;
  time: string;
  viewers?: number;
  icon?: string; // emoji or SVG short name
  verified?: boolean;
}

@Component({
  selector: 'app-citizen-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './citizen-portal.component.html',
  styleUrls: ['./citizen-portal.component.scss']
})
export class CitizenPortalComponent {
  search = '';
  categories = ['Robbery', 'Burglary', 'Cybercrime', 'Missing Person', 'Assault'];
  selectedCategory = '';

  alerts: Alert[] = [
    { id: 1, title: 'Robbery in Model Town', subtitle: 'Reported 15 mins ago', location: 'Lahore', time: '15 mins', viewers: 250, icon: '🔴', verified: true },
    { id: 2, title: 'Burglary in Gulberg', subtitle: '1 hour ago - Verified by user', location: 'Lahore', time: '1 hour', viewers: 170, icon: '🏠', verified: true },
    { id: 3, title: 'Assault in Saddar', subtitle: '2 hours ago - Verified by user', location: 'Karachi', time: '2 hours', viewers: 170, icon: '⚠️', verified: false }
  ];

  trending = [
    { title: 'Scam Alert', when: '3 hour ago' },
  ];

  setCategory(cat: string) {
    this.selectedCategory = this.selectedCategory === cat ? '' : cat;
  }

  filteredAlerts() {
    if (!this.selectedCategory) return this.alerts;
    // for demo, do simple filter by word contained in title
    return this.alerts.filter(a => a.title.toLowerCase().includes(this.selectedCategory.toLowerCase()));
  }

  openReport() {
    // replace with navigation or dialog in your app
    alert('Open Report Crime form (implement navigation)');
  }
}
