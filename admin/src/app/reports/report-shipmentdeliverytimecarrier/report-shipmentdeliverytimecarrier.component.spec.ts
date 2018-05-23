import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportShipmentdeliverytimecarrierComponent } from './report-shipmentdeliverytimecarrier.component';

describe('ReportShipmentdeliverytimecarrierComponent', () => {
  let component: ReportShipmentdeliverytimecarrierComponent;
  let fixture: ComponentFixture<ReportShipmentdeliverytimecarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportShipmentdeliverytimecarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportShipmentdeliverytimecarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
