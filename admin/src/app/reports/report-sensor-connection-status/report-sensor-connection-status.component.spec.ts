import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSensorConnectionStatusComponent } from './report-sensor-connection-status.component';

describe('ReportSensorConnectionStatusComponent', () => {
  let component: ReportSensorConnectionStatusComponent;
  let fixture: ComponentFixture<ReportSensorConnectionStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSensorConnectionStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSensorConnectionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
