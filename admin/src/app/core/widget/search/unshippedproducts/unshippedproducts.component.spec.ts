import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnshippedproductsComponent } from './unshippedproducts.component';

describe('UnshippedproductsComponent', () => {
  let component: UnshippedproductsComponent;
  let fixture: ComponentFixture<UnshippedproductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnshippedproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnshippedproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
