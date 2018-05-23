import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTourReportComponent } from './report-tour-report.component';

describe('ReportTourReportComponent', () => {
  let component: ReportTourReportComponent;
  let fixture: ComponentFixture<ReportTourReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTourReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTourReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
