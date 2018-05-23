import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppstatusComponent } from './appstatus.component';

describe('AppstatusComponent', () => {
  let component: AppstatusComponent;
  let fixture: ComponentFixture<AppstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
