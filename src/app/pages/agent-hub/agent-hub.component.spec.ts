import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentHubComponent } from './agent-hub.component';

describe('AgentHubComponent', () => {
  let component: AgentHubComponent;
  let fixture: ComponentFixture<AgentHubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentHubComponent]
    });
    fixture = TestBed.createComponent(AgentHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
