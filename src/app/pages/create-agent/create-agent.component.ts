import { Component } from '@angular/core';
import { CreateAgentModel } from './create-agent.model';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { Location } from '@angular/common';

@Component({
  selector: 'xnode-create-agent',
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.scss'],
})
export class CreateAgentComponent {
  createAgentModel: CreateAgentModel;

  constructor(
    private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private location: Location
  ) {
    this.createAgentModel = new CreateAgentModel(
      this.storageService,
      this.agentHubService,
      this.location
    );
  }

  // onCloseHandler() {}

  isCreateActive: boolean = true;

  toggleActive(isCreate: boolean): void {
    this.isCreateActive = isCreate;
  }
}
