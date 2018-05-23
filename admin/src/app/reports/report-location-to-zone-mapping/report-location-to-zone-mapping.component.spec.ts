import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLocationToZoneMappingComponent } from './report-location-to-zone-mapping.component';

describe('ReportLocationToZoneMappingComponent', () => {
  let component: ReportLocationToZoneMappingComponent;
  let fixture: ComponentFixture<ReportLocationToZoneMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportLocationToZoneMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLocationToZoneMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
