import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWorkflowComponent } from './login-workflow.component';

describe('LoginWorkflowComponent', () => {
  let component: LoginWorkflowComponent;
  let fixture: ComponentFixture<LoginWorkflowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginWorkflowComponent]
    });
    fixture = TestBed.createComponent(LoginWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
