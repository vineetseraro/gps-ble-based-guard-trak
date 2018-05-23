import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOrdersPerHospitalComponent } from './gadget-orders-per-hospital.component';

describe('GadgetOrdersPerHospitalComponent', () => {
  let component: GadgetOrdersPerHospitalComponent;
  let fixture: ComponentFixture<GadgetOrdersPerHospitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetOrdersPerHospitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOrdersPerHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
