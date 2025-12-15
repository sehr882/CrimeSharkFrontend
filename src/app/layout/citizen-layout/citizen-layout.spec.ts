import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenLayoutComponent } from './citizen-layout.component';

describe('CitizenLayout', () => {
  let component: CitizenLayoutComponent;
  let fixture: ComponentFixture<CitizenLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
