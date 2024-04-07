import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentInstructionComponent } from './agent-instruction.component';

describe('AgentInstructionComponent', () => {
  let component: AgentInstructionComponent;
  let fixture: ComponentFixture<AgentInstructionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentInstructionComponent]
    });
    fixture = TestBed.createComponent(AgentInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
