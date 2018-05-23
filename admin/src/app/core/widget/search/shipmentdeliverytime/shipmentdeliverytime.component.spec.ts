import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentdeliverytimeComponent } from './shipmentdeliverytime.component';

describe('ShipmentdeliverytimeComponent', () => {
  let component: ShipmentdeliverytimeComponent;
  let fixture: ComponentFixture<ShipmentdeliverytimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentdeliverytimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentdeliverytimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
