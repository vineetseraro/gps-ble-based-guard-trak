import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsearchComponent } from './locationsearch.component';

describe('LocationsearchComponent', () => {
  let component: LocationsearchComponent;
  let fixture: ComponentFixture<LocationsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
