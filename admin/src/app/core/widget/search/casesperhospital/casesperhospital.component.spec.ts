import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesperhospitalComponent } from './casesperhospital.component';

describe('CasesperhospitalComponent', () => {
  let component: CasesperhospitalComponent;
  let fixture: ComponentFixture<CasesperhospitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasesperhospitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesperhospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
