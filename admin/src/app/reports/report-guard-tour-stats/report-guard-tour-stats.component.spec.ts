import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEventReportComponent } from './report-event-report.component';

describe('ReportEventReportComponent', () => {
  let component: ReportEventReportComponent;
  let fixture: ComponentFixture<ReportEventReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEventReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEventReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
