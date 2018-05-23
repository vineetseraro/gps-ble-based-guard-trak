import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationaryshipmentComponent } from './stationaryshipment.component';

describe('StationaryshipmentComponent', () => {
  let component: StationaryshipmentComponent;
  let fixture: ComponentFixture<StationaryshipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationaryshipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationaryshipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
