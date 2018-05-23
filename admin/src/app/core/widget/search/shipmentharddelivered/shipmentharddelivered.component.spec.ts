import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentharddeliveredComponent } from './shipmentharddelivered.component';

describe('ShipmentharddeliveredComponent', () => {
  let component: ShipmentharddeliveredComponent;
  let fixture: ComponentFixture<ShipmentharddeliveredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentharddeliveredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentharddeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
