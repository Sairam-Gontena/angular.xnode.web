import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTopicComponent } from './agent-topic.component';

describe('AgentTopicComponent', () => {
  let component: AgentTopicComponent;
  let fixture: ComponentFixture<AgentTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentTopicComponent]
    });
    fixture = TestBed.createComponent(AgentTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
