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

  officers: any[] = [];

  officerProfile: any = null;
  profileLoading = false;
  profileError: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private officerService: OfficerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeUser();

    if (this.role === 'ADMIN') {
      this.loadOfficers();
    } else {
      this.loadOfficerProfile();
    }
  }

  initializeUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('authority_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.role = (this.currentUser.role ?? '').toUpperCase();
      }
    }
  }

  private resolveOfficerId(): string {
    const token = localStorage.getItem('authority_token') || localStorage.getItem('token') || '';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.sub) return payload.sub;
      } catch { }
    }
    return this.currentUser?._id ?? this.currentUser?.id ?? '';
  }

  loadOfficers(): void {
    this.officerService.getAllOfficers().subscribe({
      next: (data: any) => {
        this.officers = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading officers:', err);
      }
    });
  }

  loadOfficerProfile(): void {
    const id = this.resolveOfficerId();
    if (!id) {
      this.profileError = 'Unable to determine officer ID. Please log in again.';
      this.cdr.detectChanges();
      return;
    }

    this.profileLoading = true;
    this.officerService.getOfficerById(id).subscribe({
      next: (data: any) => {
        this.officerProfile = data;
        this.profileLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.profileError = err?.error?.message || err?.message || 'Failed to load profile';
        this.profileLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToAdd() {
    this.router.navigate(['/authority/add-officer']);
  }

  editOfficer(officer: any) {
    const id = officer._id || officer.id;
    this.router.navigate(['/authority/add-officer', id]);
  }
}
