import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOrderStatusComponent } from './gadget-order-status.component';

describe('GadgetOrderStatusComponent', () => {
  let component: GadgetOrderStatusComponent;
  let fixture: ComponentFixture<GadgetOrderStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetOrderStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
