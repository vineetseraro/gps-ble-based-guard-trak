import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUndeliveredProductsComponent } from './report-undelivered-products.component';

describe('ReportUndeliveredProductsComponent', () => {
  let component: ReportUndeliveredProductsComponent;
  let fixture: ComponentFixture<ReportUndeliveredProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportUndeliveredProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUndeliveredProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
