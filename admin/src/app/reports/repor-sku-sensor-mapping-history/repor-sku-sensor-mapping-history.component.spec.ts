import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporSkuSensorMappingHistoryComponent } from './repor-sku-sensor-mapping-history.component';

describe('ReporSkuSensorMappingHistoryComponent', () => {
  let component: ReporSkuSensorMappingHistoryComponent;
  let fixture: ComponentFixture<ReporSkuSensorMappingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporSkuSensorMappingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporSkuSensorMappingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
