import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentHubDetailComponent } from './agent-hub-detail.component';

describe('AgentHubDetailComponent', () => {
  let component: AgentHubDetailComponent;
  let fixture: ComponentFixture<AgentHubDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentHubDetailComponent]
    });
    fixture = TestBed.createComponent(AgentHubDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
