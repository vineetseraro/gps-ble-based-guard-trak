import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMostUsedEquipmentPerSurgeonComponent } from './report-most-used-equipment-per-surgeon.component';

describe('ReportMostUsedEquipmentPerSurgeonComponent', () => {
  let component: ReportMostUsedEquipmentPerSurgeonComponent;
  let fixture: ComponentFixture<ReportMostUsedEquipmentPerSurgeonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMostUsedEquipmentPerSurgeonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMostUsedEquipmentPerSurgeonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
