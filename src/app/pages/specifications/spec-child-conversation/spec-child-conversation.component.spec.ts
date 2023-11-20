import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecChildConversationComponent } from './spec-child-conversation.component';

describe('SpecChildConversationComponent', () => {
  let component: SpecChildConversationComponent;
  let fixture: ComponentFixture<SpecChildConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecChildConversationComponent]
    });
    fixture = TestBed.createComponent(SpecChildConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
