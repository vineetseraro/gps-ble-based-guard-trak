import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetShipmentsDueComponent } from './gadget-shipments-due.component';

describe('GadgetShipmentsDueComponent', () => {
  let component: GadgetShipmentsDueComponent;
  let fixture: ComponentFixture<GadgetShipmentsDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetShipmentsDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetShipmentsDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
