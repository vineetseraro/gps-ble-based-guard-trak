import { ResendCodeComponent } from './resend-code.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('Resend Code', () => {
  let component: ResendCodeComponent;
  let fixture: ComponentFixture<ResendCodeComponent>;
//  const testData = require('./resend-code.component.json');
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResendCodeComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

});
