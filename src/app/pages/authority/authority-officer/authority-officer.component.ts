import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { RouterModule, Router } from '@angular/router';
import { OfficerService } from '../../../services/officer.service';

@Component({
  selector: 'app-authority-officer',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, RouterModule],
  templateUrl: './authority-officer.component.html',
  styleUrls: ['./authority-officer.component.scss']
})
export class AuthorityOfficerComponent implements OnInit {

  role = '';
  currentUser: any = {};

  // ✅ This will now hold REAL data from backend
  officers: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private officerService: OfficerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
    ngOnInit(): void {
     this.initializeUser();
     this.loadOfficers();
    }

    initializeUser(): void {
     if (isPlatformBrowser(this.platformId)) {
    const storedUser = localStorage.getItem('authority_user');

    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.role = this.currentUser.role?.toUpperCase();
      console.log('Role set to:', this.role);
    }
  }
}

    // ✅ Load officers from backend

  loadOfficers(): void {
    this.officerService.getAllOfficers().subscribe({
      next: (data:any) => {
        this.officers = data;
        this.cdr.detectChanges();
        console.log('Officers loaded:', data);
      },
      error: (err:any) => {
        console.error('Error loading officers:', err);
      }
    });
  }

  goToAdd() {
    this.router.navigate(['/authority/add-officer']);
  }

  editOfficer(officer: any) {
    console.log('Edit clicked:', officer);
    const id = officer._id || officer.id;
    this.router.navigate(['/authority/add-officer', id]);
  }
}