import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentModelComponent } from './agent-model.component';

describe('AgentModelComponent', () => {
  let component: AgentModelComponent;
  let fixture: ComponentFixture<AgentModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentModelComponent]
    });
    fixture = TestBed.createComponent(AgentModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
