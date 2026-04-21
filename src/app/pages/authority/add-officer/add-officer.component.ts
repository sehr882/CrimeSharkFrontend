import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OfficerService } from '../../../services/officer.service';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-authority-add-officer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './add-officer.component.html',
  styleUrls: ['./add-officer.component.scss']
})
export class AuthorityAddOfficerComponent implements OnInit, OnDestroy {

  officerForm: FormGroup;
  message = '';
  messageType = '';
  isEditMode = false;
  officerId = '';

  ranks = ['SP', 'Inspector', 'Sub Inspector'];
  stations = ['Islamabad Central', 'Rawalpindi Sector A', 'Lahore Model Town'];
  roles = ['officer'];
  statuses = ['Active', 'Suspended'];

  private routeSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private officerService: OfficerService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    let createdBy = '';

    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('authority_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        createdBy = user.name;
      }
    }

    this.officerForm = this.fb.group({
      cnic: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{7}-\d{1}$/)]],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', Validators.email],
      phone: ['', Validators.pattern(/^03\d{9}$/)],
      rank: [''],
      station: [''],
      role: ['officer'],
      password: ['', [Validators.required, Validators.minLength(6)]],
      accessCode: ['', Validators.required],
      status: ['Active'],
      createdBy: [createdBy]
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.isEditMode = true;
        this.officerId = id;

        console.log('Edit Mode:', this.isEditMode);
        console.log('Officer ID:', this.officerId);

        this.officerForm.get('password')?.clearValidators();
        this.officerForm.get('password')?.updateValueAndValidity();
        this.officerForm.get('accessCode')?.clearValidators();
        this.officerForm.get('accessCode')?.updateValueAndValidity();

        this.officerService.getOfficerById(id).subscribe({
          next: (officer: any) => {
            this.officerForm.patchValue({
              cnic: officer.cnic,
              name: officer.name,
              email: officer.email,
              phone: officer.phone,
              rank: officer.rank,
              station: officer.station,
              role: officer.role,
              status: officer.status,
              createdBy: officer.createdBy
            });
          },
          error: (err: any) => {
            console.error('Error fetching officer:', err);
            this.message = 'Failed to load officer data';
            this.messageType = 'error';
          }
        });

      } else {
        this.isEditMode = false;
        this.officerId = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  onSubmit(): void {
    if (this.officerForm.invalid) {
      this.officerForm.markAllAsTouched();
      this.message = 'Please fill required fields correctly';
      this.messageType = 'error';
      return;
    }

    if (this.isEditMode) {
      const payload = { ...this.officerForm.value };

      if (!payload.password) delete payload.password;
      if (!payload.accessCode) delete payload.accessCode;

      this.officerService.updateOfficer(this.officerId, payload).subscribe({
        next: () => {
          this.message = 'Officer updated successfully';
          this.messageType = 'success';
          setTimeout(() => {
            this.router.navigate(['/authority/officers']);
          }, 1000);
        },
        error: (err: any) => {
          console.error(err);
          this.message = JSON.stringify(err.error);
          this.messageType = 'error';
        }
      });

    } else {
      this.officerService.addOfficer(this.officerForm.value).subscribe({
        next: () => {
          this.message = 'Officer added successfully';
          this.messageType = 'success';
          setTimeout(() => {
            this.router.navigate(['/authority/officers']);
          }, 1000);
        },
        error: (err: any) => {
          console.error(err);
          this.message = JSON.stringify(err.error);
          this.messageType = 'error';
        }
      });
    }
  }
}
