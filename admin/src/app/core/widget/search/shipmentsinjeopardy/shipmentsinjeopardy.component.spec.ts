import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentsinjeopardyComponent } from './shipmentsinjeopardy.component';

describe('ShipmentsinjeopardyComponent', () => {
  let component: ShipmentsinjeopardyComponent;
  let fixture: ComponentFixture<ShipmentsinjeopardyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentsinjeopardyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentsinjeopardyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
