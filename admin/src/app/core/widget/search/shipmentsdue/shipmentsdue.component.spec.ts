import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentsdueComponent } from './shipmentsdue.component';

describe('ShipmentsdueComponent', () => {
  let component: ShipmentsdueComponent;
  let fixture: ComponentFixture<ShipmentsdueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentsdueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentsdueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
