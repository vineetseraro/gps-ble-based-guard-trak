import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOrdersBySurgeryTypeComponent } from './gadget-orders-by-surgery-type.component';

describe('GadgetOrdersBySurgeryTypeComponent', () => {
  let component: GadgetOrdersBySurgeryTypeComponent;
  let fixture: ComponentFixture<GadgetOrdersBySurgeryTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetOrdersBySurgeryTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOrdersBySurgeryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
