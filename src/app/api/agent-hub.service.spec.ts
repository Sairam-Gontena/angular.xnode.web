import { TestBed } from '@angular/core/testing';

import { AgentHubService } from './agent-hub.service';

describe('AgentHubService', () => {
  let service: AgentHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
