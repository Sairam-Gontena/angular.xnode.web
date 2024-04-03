import { Component } from '@angular/core';
import { CreateAgentModel } from './create-agent.model';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { Location } from '@angular/common';
import { UtilsService } from 'src/app/components/services/utils.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'xnode-create-agent',
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.scss'],
})
export class CreateAgentComponent {
  createAgentModel: CreateAgentModel;

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private location: Location,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder) {
    this.createAgentModel = new CreateAgentModel(
      this.storageService,
      this.agentHubService,
      this.location,
      this.utilsService,
      this.formBuilder
    );
  }

  // onCloseHandler() {}

  isCreateActive: boolean = true;

  toggleActive(isCreate: boolean): void {
    this.isCreateActive = isCreate;
  }
}
