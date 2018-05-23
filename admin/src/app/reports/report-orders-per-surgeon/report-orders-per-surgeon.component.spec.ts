import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOrdersPerSurgeonComponent } from './report-orders-per-surgeon.component';

describe('ReportOrdersPerSurgeonComponent', () => {
  let component: ReportOrdersPerSurgeonComponent;
  let fixture: ComponentFixture<ReportOrdersPerSurgeonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOrdersPerSurgeonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOrdersPerSurgeonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
