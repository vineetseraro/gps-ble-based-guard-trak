import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportShipmentDueComponent } from './report-shipment-due.component';

describe('ReportShipmentDueComponent', () => {
  let component: ReportShipmentDueComponent;
  let fixture: ComponentFixture<ReportShipmentDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportShipmentDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportShipmentDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
