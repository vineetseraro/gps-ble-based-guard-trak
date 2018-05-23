import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetShipmentStatusComponent } from './gadget-shipment-status.component';

describe('GadgetShipmentStatusComponent', () => {
  let component: GadgetShipmentStatusComponent;
  let fixture: ComponentFixture<GadgetShipmentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetShipmentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetShipmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
