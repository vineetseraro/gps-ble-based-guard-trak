import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSkuSensorMappingComponent } from './report-sku-sensor-mapping.component';

describe('ReportSkuSensorMappingComponent', () => {
  let component: ReportSkuSensorMappingComponent;
  let fixture: ComponentFixture<ReportSkuSensorMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSkuSensorMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSkuSensorMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
