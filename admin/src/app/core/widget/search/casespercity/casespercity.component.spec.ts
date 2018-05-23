import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasespercityComponent } from './casespercity.component';

describe('CasespercityComponent', () => {
  let component: CasespercityComponent;
  let fixture: ComponentFixture<CasespercityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasespercityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasespercityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
