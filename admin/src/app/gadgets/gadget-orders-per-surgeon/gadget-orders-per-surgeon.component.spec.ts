import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOrdersPerSurgeonComponent } from './gadget-orders-per-surgeon.component';

describe('GadgetOrdersPerSurgeonComponent', () => {
  let component: GadgetOrdersPerSurgeonComponent;
  let fixture: ComponentFixture<GadgetOrdersPerSurgeonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetOrdersPerSurgeonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOrdersPerSurgeonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
