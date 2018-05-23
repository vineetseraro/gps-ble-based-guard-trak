import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOrdersPerCityComponent } from './gadget-orders-per-city.component';

describe('GadgetOrdersPerCityComponent', () => {
  let component: GadgetOrdersPerCityComponent;
  let fixture: ComponentFixture<GadgetOrdersPerCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetOrdersPerCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOrdersPerCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
