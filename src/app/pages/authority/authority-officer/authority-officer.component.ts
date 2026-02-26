import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
    selector: 'app-authority-officer',
    standalone: true,
    imports: [CommonModule, BackButtonComponent, RouterModule,], // ✅ ADD THIS
    templateUrl: './authority-officer.component.html',
    styleUrls: ['./authority-officer.component.scss']
})
export class AuthorityOfficerComponent implements OnInit {

    role = '';
    currentUser: any = {};

    officers = [
        {
            name: 'Ali Khan',
            rank: 'SP',
            station: 'Islamabad Central',
            status: 'Active'
        },
        {
            name: 'Ahmed Raza',
            rank: 'Inspector',
            station: 'Rawalpindi Sector A',
            status: 'Active'
        },
        {
            name: 'Usman Tariq',
            rank: 'Sub Inspector',
            station: 'Lahore Model Town',
            status: 'Suspended'
        }
    ];

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }
    goToAdd() {
        console.log('Navigating...');
        this.router.navigate(['/authority/add-officer']);
    }

    ngOnInit(): void {

        if (isPlatformBrowser(this.platformId)) {

            const storedUser = localStorage.getItem('authority_user');

            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
                this.role = this.currentUser.role;
            }
        }
    }
}