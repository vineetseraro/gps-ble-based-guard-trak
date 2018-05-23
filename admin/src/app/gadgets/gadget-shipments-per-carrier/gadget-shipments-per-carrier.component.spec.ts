import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetShipmentsPerCarrierComponent } from './gadget-shipments-per-carrier.component';

describe('GadgetShipmentsPerCarrierComponent', () => {
  let component: GadgetShipmentsPerCarrierComponent;
  let fixture: ComponentFixture<GadgetShipmentsPerCarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetShipmentsPerCarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetShipmentsPerCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
