import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCarrierwiseDelayedDeliveryComponent } from './report-carrierwise-delayed-delivery.component';

describe('ReportCarrierwiseDelayedDeliveryComponent', () => {
  let component: ReportCarrierwiseDelayedDeliveryComponent;
  let fixture: ComponentFixture<ReportCarrierwiseDelayedDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCarrierwiseDelayedDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCarrierwiseDelayedDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
