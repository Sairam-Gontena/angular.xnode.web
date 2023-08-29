import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFeedbackComponent } from './product-feedback.component';

describe('AllFeedbackComponent', () => {
  let component: AllFeedbackComponent;
  let fixture: ComponentFixture<AllFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllFeedbackComponent]
    });
    fixture = TestBed.createComponent(AllFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
