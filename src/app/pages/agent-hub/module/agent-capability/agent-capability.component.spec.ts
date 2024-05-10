import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCapabilityComponent } from './agent-capability.component';

describe('AgentCapabilityComponent', () => {
  let component: AgentCapabilityComponent;
  let fixture: ComponentFixture<AgentCapabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentCapabilityComponent]
    });
    fixture = TestBed.createComponent(AgentCapabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
