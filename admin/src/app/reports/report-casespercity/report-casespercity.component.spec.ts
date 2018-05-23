import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCasespercityComponent } from './report-casespercity.component';

describe('ReportCasespercityComponent', () => {
  let component: ReportCasespercityComponent;
  let fixture: ComponentFixture<ReportCasespercityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCasespercityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCasespercityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
