import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { ActivatedRoute } from '@angular/router';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignupComponent, BackButtonComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  redirectFrom: string | null = null;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.redirectFrom = this.route.snapshot.queryParamMap.get('from');
  }


  isLogin = true;

  toggleTab(val: boolean) {
    // *ngIf already destroys/recreates the inactive form — no flicker hack needed.
    this.isLogin = val;
  }
}


