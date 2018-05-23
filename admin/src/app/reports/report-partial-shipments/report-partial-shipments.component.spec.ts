import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPartialShipmentsComponent } from './report-partial-shipments.component';

describe('ReportPartialShipmentsComponent', () => {
  let component: ReportPartialShipmentsComponent;
  let fixture: ComponentFixture<ReportPartialShipmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPartialShipmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPartialShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
