import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSalesrepWiseProductOrderComponent } from './report-salesrep-wise-product-order.component';

describe('ReportSalesrepWiseProductOrderComponent', () => {
  let component: ReportSalesrepWiseProductOrderComponent;
  let fixture: ComponentFixture<ReportSalesrepWiseProductOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSalesrepWiseProductOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSalesrepWiseProductOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
