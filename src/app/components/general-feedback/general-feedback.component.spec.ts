import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralFeedbackComponent } from './general-feedback.component';

describe('GeneralFeedbackComponent', () => {
  let component: GeneralFeedbackComponent;
  let fixture: ComponentFixture<GeneralFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralFeedbackComponent]
    });
    fixture = TestBed.createComponent(GeneralFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
