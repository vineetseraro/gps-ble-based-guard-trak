import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasespersurgeonComponent } from './casespersurgeon.component';

describe('CasespersurgeonComponent', () => {
  let component: CasespersurgeonComponent;
  let fixture: ComponentFixture<CasespersurgeonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasespersurgeonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasespersurgeonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
