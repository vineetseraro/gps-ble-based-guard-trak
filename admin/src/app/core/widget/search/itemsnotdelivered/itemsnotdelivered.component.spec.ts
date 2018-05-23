import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsnotdeliveredComponent } from './itemsnotdelivered.component';

describe('ItemsnotdeliveredComponent', () => {
  let component: ItemsnotdeliveredComponent;
  let fixture: ComponentFixture<ItemsnotdeliveredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsnotdeliveredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsnotdeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
