import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOrdersPerSalesRepComponent } from './gadget-orders-per-sales-rep.component';

describe('GadgetOrdersPerSalesRepComponent', () => {
  let component: GadgetOrdersPerSalesRepComponent;
  let fixture: ComponentFixture<GadgetOrdersPerSalesRepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetOrdersPerSalesRepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOrdersPerSalesRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
