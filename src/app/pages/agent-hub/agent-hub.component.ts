import { Component, OnInit } from '@angular/core';
import { AgentHubModel } from './agent-hub.model';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';

@Component({
  selector: 'xnode-agent-hub',
  templateUrl: './agent-hub.component.html',
  styleUrls: ['./agent-hub.component.scss']
})
export class AgentHubComponent implements OnInit {

  agentHubModel: AgentHubModel;

  constructor(
    private storageService: LocalStorageService,
    private agentHubService: AgentHubService) {
    this.agentHubModel = new AgentHubModel(this.storageService, this.agentHubService)
  }

  ngOnInit() { 
    this.agentHubModel.getAllAgentList()
  }

}

