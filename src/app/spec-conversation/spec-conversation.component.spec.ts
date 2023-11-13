import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecConversationComponent } from './spec-conversation.component';

describe('SpecConversationComponent', () => {
  let component: SpecConversationComponent;
  let fixture: ComponentFixture<SpecConversationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecConversationComponent]
    });
    fixture = TestBed.createComponent(SpecConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
