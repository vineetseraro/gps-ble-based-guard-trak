import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGatewaySearchComponent } from './app-gateway-search.component';

describe('AppGatewaySearchComponent', () => {
  let component: AppGatewaySearchComponent;
  let fixture: ComponentFixture<AppGatewaySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGatewaySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGatewaySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
