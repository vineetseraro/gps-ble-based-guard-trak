import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOrderDueComponent } from './gadget-order-due.component';

describe('GadgetOrderDueComponent', () => {
  let component: GadgetOrderDueComponent;
  let fixture: ComponentFixture<GadgetOrderDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetOrderDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOrderDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
