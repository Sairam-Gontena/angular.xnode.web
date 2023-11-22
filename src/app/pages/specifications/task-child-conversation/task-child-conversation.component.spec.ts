import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskChildConversationComponent } from './task-child-conversation.component';

describe('TaskChildConversationComponent', () => {
  let component: TaskChildConversationComponent;
  let fixture: ComponentFixture<TaskChildConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskChildConversationComponent]
    });
    fixture = TestBed.createComponent(TaskChildConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
