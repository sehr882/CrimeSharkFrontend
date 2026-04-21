import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCrimeComponent } from './report-crime.component';

describe('ReportCrime', () => {
  let component: ReportCrimeComponent;
  let fixture: ComponentFixture<ReportCrimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCrimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCrimeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
