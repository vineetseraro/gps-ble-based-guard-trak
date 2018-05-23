import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetAppStatusComponent } from './gadget-app-status.component';

describe('GadgetAppStatusComponent', () => {
  let component: GadgetAppStatusComponent;
  let fixture: ComponentFixture<GadgetAppStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetAppStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetAppStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
