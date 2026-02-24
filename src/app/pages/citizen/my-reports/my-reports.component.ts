import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
    selector: 'app-my-reports',
    standalone: true,
    imports: [CommonModule, RouterModule, BackButtonComponent],
    templateUrl: './my-reports.component.html',
    styleUrl: './my-reports.component.scss'
})
export class MyReportsComponent implements OnInit {

    reports: any[] = [];

    ngOnInit(): void {
        this.loadReports();
    }

    loadReports() {
        // Dummy data (simulate logged-in user's reports)
        this.reports = [
            {
                id: 1,
                crimeType: 'Robbery',
                location: 'Saddar, Rawalpindi',
                description: 'Mobile snatching incident near market area.',
                status: 'Pending',
                createdAt: new Date()
            },
            {
                id: 2,
                crimeType: 'Harassment',
                location: 'Commercial Market',
                description: 'Suspicious individual following people at night.',
                status: 'Resolved',
                createdAt: new Date()
            }
        ];
    }

}