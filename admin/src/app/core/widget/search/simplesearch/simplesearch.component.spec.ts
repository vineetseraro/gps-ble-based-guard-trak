import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplesearchComponent } from './simplesearch.component';

describe('SimplesearchComponent', () => {
  let component: SimplesearchComponent;
  let fixture: ComponentFixture<SimplesearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimplesearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplesearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
