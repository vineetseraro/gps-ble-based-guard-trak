import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationzonesComponent } from './locationzones.component';

describe('LocationzonesComponent', () => {
  let component: LocationzonesComponent;
  let fixture: ComponentFixture<LocationzonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationzonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationzonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
