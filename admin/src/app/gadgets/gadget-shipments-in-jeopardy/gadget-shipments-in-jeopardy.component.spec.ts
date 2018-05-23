import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetShipmentsInJeopardyComponent } from './gadget-shipments-in-jeopardy.component';

describe('GadgetShipmentsInJeopardyComponent', () => {
  let component: GadgetShipmentsInJeopardyComponent;
  let fixture: ComponentFixture<GadgetShipmentsInJeopardyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetShipmentsInJeopardyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetShipmentsInJeopardyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
