import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorstatusComponent } from './sensorstatus.component';

describe('SensorstatusComponent', () => {
  let component: SensorstatusComponent;
  let fixture: ComponentFixture<SensorstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
