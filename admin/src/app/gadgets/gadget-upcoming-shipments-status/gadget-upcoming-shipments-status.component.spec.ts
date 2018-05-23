import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetUpcomingShipmentsStatusComponent } from './gadget-upcoming-shipments-status.component';

describe('GadgetUpcomingShipmentsStatusComponent', () => {
  let component: GadgetUpcomingShipmentsStatusComponent;
  let fixture: ComponentFixture<GadgetUpcomingShipmentsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetUpcomingShipmentsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetUpcomingShipmentsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
