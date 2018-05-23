import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3donutchartComponent } from './d3donutchart.component';

describe('D3donutchartComponent', () => {
  let component: D3donutchartComponent;
  let fixture: ComponentFixture<D3donutchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3donutchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3donutchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
