import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSurgeryDatePassedOpenCasesComponent } from './report-surgery-date-passed-open-cases.component';

describe('ReportSurgeryDatePassedOpenCasesComponent', () => {
  let component: ReportSurgeryDatePassedOpenCasesComponent;
  let fixture: ComponentFixture<ReportSurgeryDatePassedOpenCasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSurgeryDatePassedOpenCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSurgeryDatePassedOpenCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
