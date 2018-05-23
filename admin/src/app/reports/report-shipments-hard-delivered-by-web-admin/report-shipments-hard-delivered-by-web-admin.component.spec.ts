import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportShipmentsHardDeliveredByWebAdminComponent } from './report-shipments-hard-delivered-by-web-admin.component';

describe('ReportShipmentsHardDeliveredByWebAdminComponent', () => {
  let component: ReportShipmentsHardDeliveredByWebAdminComponent;
  let fixture: ComponentFixture<ReportShipmentsHardDeliveredByWebAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportShipmentsHardDeliveredByWebAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportShipmentsHardDeliveredByWebAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
