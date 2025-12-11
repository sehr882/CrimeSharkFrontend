import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityLoginComponent } from './authority-login.component';

describe('AuthorityLogin', () => {
  let component: AuthorityLoginComponent;
  let fixture: ComponentFixture<AuthorityLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
