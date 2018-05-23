import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostusedequipmentpersurgeonComponent } from './mostusedequipmentpersurgeon.component';

describe('MostusedequipmentpersurgeonComponent', () => {
  let component: MostusedequipmentpersurgeonComponent;
  let fixture: ComponentFixture<MostusedequipmentpersurgeonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostusedequipmentpersurgeonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostusedequipmentpersurgeonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
