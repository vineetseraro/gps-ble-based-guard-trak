import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkusensorComponent } from './skusensor.component';

describe('SkusensorComponent', () => {
  let component: SkusensorComponent;
  let fixture: ComponentFixture<SkusensorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkusensorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkusensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
