import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExistingFeedbackComponent } from './view-existing-feedback.component';

describe('ViewExistingFeedbackComponent', () => {
  let component: ViewExistingFeedbackComponent;
  let fixture: ComponentFixture<ViewExistingFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewExistingFeedbackComponent]
    });
    fixture = TestBed.createComponent(ViewExistingFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
