import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
    selector: 'app-add-officer',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, BackButtonComponent],
    templateUrl: './add-officer.component.html',
    styleUrls: ['./add-officer.component.scss']
})
export class AddOfficerComponent implements OnInit {

    officerForm!: FormGroup;
    currentUser: any = {};
    message = '';
    messageType: 'success' | 'error' | '' = '';

    ranks = ['Inspector', 'Sub Inspector', 'ASI', 'Head Constable', 'Constable'];
    stations = [
        'Rawalpindi Central',
        'Saddar Station',
        'Airport Station',
        'Civil Lines',
        'Women Police Station'
    ];
    roles = ['admin', 'officer'];
    statuses = ['active', 'suspended'];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {

        if (isPlatformBrowser(this.platformId)) {
            const storedUser = localStorage.getItem('authority_user');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            }

            if (!this.currentUser || this.currentUser.role !== 'ADMIN') {
                this.router.navigate(['/authority']);
                return;
            }
        }

        this.initializeForm();
    }

    initializeForm() {
        this.officerForm = this.fb.group({

            cnic: ['', [
                Validators.required,
                Validators.pattern(/^\d{5}-\d{7}-\d{1}$/)
            ]],

            name: ['', [
                Validators.required,
                Validators.pattern(/^[A-Za-z ]{3,}$/)
            ]],

            email: ['', [
                Validators.required,
                Validators.email
            ]],

            phone: ['', [
                Validators.required,
                Validators.pattern(/^03\d{9}$/)
            ]],

            rank: ['', Validators.required],
            station: ['', Validators.required],
            role: ['', Validators.required],

            password: ['', [
                Validators.required,
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
            ]],

            accessCode: ['', [
                Validators.required,
                Validators.pattern(/^\d{6}$/)
            ]],

            status: ['', Validators.required],

            createdBy: [{
                value: this.currentUser?.name || '',
                disabled: true
            }]
        });
    }

    onSubmit() {

        this.message = '';
        this.messageType = '';

        if (this.officerForm.invalid) {
            this.messageType = 'error';
            this.message = this.getDetailedErrorMessage();
            this.officerForm.markAllAsTouched();
            return;
        }

        const newOfficer = this.officerForm.getRawValue();
        console.log('Officer Created:', newOfficer);

        this.messageType = 'success';
        this.message = 'Officer added successfully.';

        this.officerForm.reset();
    }

    getDetailedErrorMessage(): string {

        const controls = this.officerForm.controls;

        if (controls['cnic'].errors) {
            return 'CNIC must be in format 12345-6789023-5.';
        }

        if (controls['name'].errors) {
            return 'Name must contain only letters and at least 3 characters.';
        }

        if (controls['email'].errors) {
            return 'Please enter a valid email address.';
        }

        if (controls['phone'].errors) {
            return 'Phone number must be in format 03XXXXXXXXX.';
        }

        if (controls['rank'].errors) {
            return 'Please select a rank.';
        }

        if (controls['station'].errors) {
            return 'Please select a station.';
        }

        if (controls['role'].errors) {
            return 'Please select a role.';
        }

        if (controls['password'].errors) {
            return 'Password must be 8+ chars with uppercase, lowercase, number & special character.';
        }

        if (controls['accessCode'].errors) {
            return 'Access code must be exactly 6 digits.';
        }

        if (controls['status'].errors) {
            return 'Please select status.';
        }

        return 'Please fill all required fields correctly.';
    }

}