import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
    selector: 'app-authority-officer',
    standalone: true,
    imports: [CommonModule, BackButtonComponent],
    templateUrl: './authority-officer.component.html',
    styleUrls: ['./authority-officer.component.scss']
})
export class AuthorityOfficerComponent implements OnInit {

    role = '';
    currentUser: any;

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

    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('authorityUser') || '{}');
        this.role = this.currentUser.role;
    }

}