import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesnotclosedComponent } from './casesnotclosed.component';

describe('CasesnotclosedComponent', () => {
  let component: CasesnotclosedComponent;
  let fixture: ComponentFixture<CasesnotclosedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasesnotclosedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesnotclosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
