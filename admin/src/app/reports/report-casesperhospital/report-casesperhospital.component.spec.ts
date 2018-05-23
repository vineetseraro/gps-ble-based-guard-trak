import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCasesperhospitalComponent } from './report-casesperhospital.component';

describe('ReportCasesperhospitalComponent', () => {
  let component: ReportCasesperhospitalComponent;
  let fixture: ComponentFixture<ReportCasesperhospitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCasesperhospitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCasesperhospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
