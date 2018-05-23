import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetOpenServiceRequestsComponent } from './gadget-open-service-requests.component';

describe('GadgetOpenServiceRequestsComponent', () => {
  let component: GadgetOpenServiceRequestsComponent;
  let fixture: ComponentFixture<GadgetOpenServiceRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GadgetOpenServiceRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GadgetOpenServiceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
