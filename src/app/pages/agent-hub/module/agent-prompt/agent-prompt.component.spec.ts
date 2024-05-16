import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPromptComponent } from './agent-prompt.component';

describe('AgentPromptComponent', () => {
  let component: AgentPromptComponent;
  let fixture: ComponentFixture<AgentPromptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentPromptComponent]
    });
    fixture = TestBed.createComponent(AgentPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
