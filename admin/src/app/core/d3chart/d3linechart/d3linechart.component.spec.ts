import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3linechartComponent } from './d3linechart.component';

describe('D3linechartComponent', () => {
  let component: D3linechartComponent;
  let fixture: ComponentFixture<D3linechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3linechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3linechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
