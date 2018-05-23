import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetTotalOrdersShipmentsComponent } from './gadget-total-orders-shipments.component';

describe('GadgetTotalOrdersShipmentsComponent', () => {
  let component: GadgetTotalOrdersShipmentsComponent;
  let fixture: ComponentFixture<GadgetTotalOrdersShipmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetTotalOrdersShipmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetTotalOrdersShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
