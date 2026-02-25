import { Component } from '@angular/core';
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
export class CaseAssignmentComponent {

    cases = [
        {
            id: 'CS-201',
            type: 'Robbery',
            location: 'Zone 3',
            date: '23 Feb 2026',
            status: 'Pending',
            assignedTo: 'Officer Ahmed Khan'
        },
        {
            id: 'CS-202',
            type: 'Assault',
            location: 'Zone 1',
            date: '22 Feb 2026',
            status: 'Urgent',
            assignedTo: 'Officer Sarah Malik'
        },
        {
            id: 'CS-203',
            type: 'Theft',
            location: 'Zone 5',
            date: '21 Feb 2026',
            status: 'Pending',
            assignedTo: 'Officer Usman Ali'
        }
    ];

}