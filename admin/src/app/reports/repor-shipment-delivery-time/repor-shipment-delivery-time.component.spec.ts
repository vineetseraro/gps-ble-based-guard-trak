import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporShipmentDeliveryTimeComponent } from './repor-shipment-delivery-time.component';

describe('ReporShipmentDeliveryTimeComponent', () => {
  let component: ReporShipmentDeliveryTimeComponent;
  let fixture: ComponentFixture<ReporShipmentDeliveryTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporShipmentDeliveryTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporShipmentDeliveryTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
