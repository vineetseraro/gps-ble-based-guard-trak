import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsreadytodispatchComponent } from './productsreadytodispatch.component';

describe('ProductsreadytodispatchComponent', () => {
  let component: ProductsreadytodispatchComponent;
  let fixture: ComponentFixture<ProductsreadytodispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsreadytodispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsreadytodispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
