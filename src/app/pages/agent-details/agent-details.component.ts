import { Component, OnInit } from '@angular/core';
import { AgentDetailsModel } from './agent-details.model';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';

@Component({
  selector: 'xnode-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.scss']
})
export class AgentDetailsComponent{

  agentDetailsModel: AgentDetailsModel;

  constructor(
    private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
  ) {
    this.agentDetailsModel = new AgentDetailsModel(
      this.storageService,
      this.agentHubService,
    );
  }
}
