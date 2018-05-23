import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporShipmentsCountByLocationComponent } from './repor-shipments-count-by-location.component';

describe('ReporShipmentsCountByLocationComponent', () => {
  let component: ReporShipmentsCountByLocationComponent;
  let fixture: ComponentFixture<ReporShipmentsCountByLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporShipmentsCountByLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporShipmentsCountByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
