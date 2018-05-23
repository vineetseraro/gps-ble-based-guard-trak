import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { shipmentdeliverytimecarrierComponent } from './shipmentdeliverytimecarrier.component';

describe('shipmentdeliverytimecarrierComponent', () => {
  let component: shipmentdeliverytimecarrierComponent;
  let fixture: ComponentFixture<shipmentdeliverytimecarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ shipmentdeliverytimecarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(shipmentdeliverytimecarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
