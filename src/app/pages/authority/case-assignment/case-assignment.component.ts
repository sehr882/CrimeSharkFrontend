import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
    selector: 'app-case-assignment',
    standalone: true,
    imports: [CommonModule, FormsModule, BackButtonComponent],
    templateUrl: './case-assignment.component.html',
    styleUrls: ['./case-assignment.component.scss']
})
export class CaseAssignmentComponent implements OnInit {

    role = '';
    currentUser: any;
    pageTitle = '';
    pageSubtitle = '';

    officers = [
        'Ali Khan',
        'Ahmed Raza',
        'Usman Tariq'
    ];

    cases = [
        {
            id: 'CS-201',
            type: 'Robbery',
            location: 'Zone 3',
            date: '23 Feb 2026',
            status: 'Pending',
            assignedTo: 'Ahmed Raza'
        },
        {
            id: 'CS-202',
            type: 'Assault',
            location: 'Zone 1',
            date: '22 Feb 2026',
            status: 'Urgent',
            assignedTo: 'Ali Khan'
        },
        {
            id: 'CS-203',
            type: 'Theft',
            location: 'Zone 5',
            date: '21 Feb 2026',
            status: 'Pending',
            assignedTo: 'Usman Tariq'
        }
    ];

    ngOnInit(): void {

        this.currentUser = JSON.parse(localStorage.getItem('authority_user') || '{}');
        this.role = this.currentUser.role;

        if (this.role === 'ADMIN') {
            this.pageTitle = 'Case Assignment';
            this.pageSubtitle = 'Assign cases to available officers';
        } else {
            this.pageTitle = 'My Cases';
            this.pageSubtitle = 'Cases assigned to you';
            this.filterCasesForOfficer();
        }
    }

    // 🔥 Officer sees only their cases
    filterCasesForOfficer() {
        this.cases = this.cases.filter(
            c => c.assignedTo === this.currentUser.name
        );
    }

    // 🔥 Only Super Admin can assign
    assignCase(caseItem: any, officerName: string) {
        if (this.role !== 'super_admin') return;

        caseItem.assignedTo = officerName;
    }

}