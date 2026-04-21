import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenPortalComponent } from './citizen-portal.component';

describe('CitizenPortal', () => {
  let component: CitizenPortalComponent;
  let fixture: ComponentFixture<CitizenPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenPortalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
