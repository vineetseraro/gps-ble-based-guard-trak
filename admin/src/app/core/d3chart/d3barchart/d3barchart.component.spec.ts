import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3barchartComponent } from './d3barchart.component';

describe('D3barchartComponent', () => {
  let component: D3barchartComponent;
  let fixture: ComponentFixture<D3barchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3barchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3barchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
