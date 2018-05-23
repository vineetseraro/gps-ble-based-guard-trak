import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasespersurgeryComponent } from './casespersurgery.component';

describe('CasespersurgeryComponent', () => {
  let component: CasespersurgeryComponent;
  let fixture: ComponentFixture<CasespersurgeryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasespersurgeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasespersurgeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
