import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackConversationComponent } from './feedback-conversation.component';

describe('FeedbackConversationComponent', () => {
  let component: FeedbackConversationComponent;
  let fixture: ComponentFixture<FeedbackConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackConversationComponent]
    });
    fixture = TestBed.createComponent(FeedbackConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
