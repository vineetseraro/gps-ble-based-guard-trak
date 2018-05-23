import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentscountbylocationComponent } from './shipmentscountbylocation.component';

describe('ShipmentscountbylocationComponent', () => {
  let component: ShipmentscountbylocationComponent;
  let fixture: ComponentFixture<ShipmentscountbylocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentscountbylocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentscountbylocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
