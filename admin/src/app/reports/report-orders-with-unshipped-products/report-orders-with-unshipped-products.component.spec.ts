import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOrdersWithUnshippedProductsComponent } from './report-orders-with-unshipped-products.component';

describe('ReportOrdersWithUnshippedProductsComponent', () => {
  let component: ReportOrdersWithUnshippedProductsComponent;
  let fixture: ComponentFixture<ReportOrdersWithUnshippedProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOrdersWithUnshippedProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOrdersWithUnshippedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
