import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingWorkflowComponent } from './onboarding-workflow.component';

describe('OnboardingWorkflowComponent', () => {
  let component: OnboardingWorkflowComponent;
  let fixture: ComponentFixture<OnboardingWorkflowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingWorkflowComponent]
    });
    fixture = TestBed.createComponent(OnboardingWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
