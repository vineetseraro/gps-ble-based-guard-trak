import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkusensorhistoryComponent } from './skusensorhistory.component';

describe('SkusensorhistoryComponent', () => {
  let component: SkusensorhistoryComponent;
  let fixture: ComponentFixture<SkusensorhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkusensorhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkusensorhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
