import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloormapComponent } from './floormap.component';

describe('FloormapComponent', () => {
  let component: FloormapComponent;
  let fixture: ComponentFixture<FloormapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloormapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloormapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
