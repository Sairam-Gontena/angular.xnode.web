import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationHubComponent } from './conversation-hub.component';

describe('ConversationHubComponent', () => {
  let component: ConversationHubComponent;
  let fixture: ComponentFixture<ConversationHubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationHubComponent]
    });
    fixture = TestBed.createComponent(ConversationHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
