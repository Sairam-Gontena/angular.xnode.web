import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureAgentComponent } from './configure-agent.component';

describe('ConfigureAgentComponent', () => {
  let component: ConfigureAgentComponent;
  let fixture: ComponentFixture<ConfigureAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureAgentComponent]
    });
    fixture = TestBed.createComponent(ConfigureAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
