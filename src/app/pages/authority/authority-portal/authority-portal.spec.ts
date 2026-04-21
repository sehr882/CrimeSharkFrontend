import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityPortalComponent } from './authority-portal.component';

describe('AuthorityPortal', () => {
  let component: AuthorityPortalComponent;
  let fixture: ComponentFixture<AuthorityPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityPortalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
