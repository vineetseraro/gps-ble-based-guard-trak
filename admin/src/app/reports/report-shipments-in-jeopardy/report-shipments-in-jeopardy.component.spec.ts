import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportShipmentsInJeopardyComponent } from './report-shipments-in-jeopardy.component';

describe('ReportShipmentsInJeopardyComponent', () => {
  let component: ReportShipmentsInJeopardyComponent;
  let fixture: ComponentFixture<ReportShipmentsInJeopardyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportShipmentsInJeopardyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportShipmentsInJeopardyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
