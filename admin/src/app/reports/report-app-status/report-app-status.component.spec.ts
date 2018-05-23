import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAppStatusComponent } from './report-app-status.component';

describe('ReportAppStatusComponent', () => {
  let component: ReportAppStatusComponent;
  let fixture: ComponentFixture<ReportAppStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAppStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAppStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
