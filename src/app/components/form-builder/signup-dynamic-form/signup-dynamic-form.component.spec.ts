import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupDynamicFormComponent } from './signup-dynamic-form.component';

describe('SignupDynamicFormComponent', () => {
  let component: SignupDynamicFormComponent;
  let fixture: ComponentFixture<SignupDynamicFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupDynamicFormComponent]
    });
    fixture = TestBed.createComponent(SignupDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
