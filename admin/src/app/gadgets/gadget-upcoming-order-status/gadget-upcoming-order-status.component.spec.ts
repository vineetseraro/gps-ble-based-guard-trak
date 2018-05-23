import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetUpcomingOrderStatusComponent } from './gadget-upcoming-order-status.component';

describe('GadgetUpcomingOrderStatusComponent', () => {
  let component: GadgetUpcomingOrderStatusComponent;
  let fixture: ComponentFixture<GadgetUpcomingOrderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetUpcomingOrderStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetUpcomingOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
