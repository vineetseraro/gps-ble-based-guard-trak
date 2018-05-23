import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialshipmentsComponent } from './partialshipments.component';

describe('PartialshipmentsComponent', () => {
  let component: PartialshipmentsComponent;
  let fixture: ComponentFixture<PartialshipmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialshipmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialshipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
