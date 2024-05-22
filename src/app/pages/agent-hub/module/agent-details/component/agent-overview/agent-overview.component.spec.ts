import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentOverviewComponent } from './agent-overview.component';

describe('AgentOverviewComponent', () => {
  let component: AgentOverviewComponent;
  let fixture: ComponentFixture<AgentOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentOverviewComponent]
    });
    fixture = TestBed.createComponent(AgentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
