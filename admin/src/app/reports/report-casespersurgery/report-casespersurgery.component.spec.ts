import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCasespersurgeryComponent } from './report-casespersurgery.component';

describe('ReportCasespersurgeryComponent', () => {
  let component: ReportCasespersurgeryComponent;
  let fixture: ComponentFixture<ReportCasespersurgeryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCasespersurgeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCasespersurgeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
