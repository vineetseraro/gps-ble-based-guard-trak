import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStationaryShipmentsComponent } from './report-stationary-shipments.component';

describe('ReportStationaryShipmentsComponent', () => {
  let component: ReportStationaryShipmentsComponent;
  let fixture: ComponentFixture<ReportStationaryShipmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportStationaryShipmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportStationaryShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
