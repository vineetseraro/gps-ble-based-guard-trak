import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProductsReadyToDispatchComponent } from './report-products-ready-to-dispatch.component';

describe('ReportProductsReadyToDispatchComponent', () => {
  let component: ReportProductsReadyToDispatchComponent;
  let fixture: ComponentFixture<ReportProductsReadyToDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportProductsReadyToDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProductsReadyToDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
