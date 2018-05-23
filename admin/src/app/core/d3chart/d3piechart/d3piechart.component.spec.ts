import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3piechartComponent } from './d3piechart.component';

describe('D3piechartComponent', () => {
  let component: D3piechartComponent;
  let fixture: ComponentFixture<D3piechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3piechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3piechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
