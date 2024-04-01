import { Component } from '@angular/core';
import { AgentDetailsModel } from './agent-details.model';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IQueryParams } from './IAgent-details';

@Component({
  selector: 'xnode-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.scss']
})
export class AgentDetailsComponent {

  agentDetailsModel: AgentDetailsModel;

  constructor(
    private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private activeRoute: ActivatedRoute
  ) {
    this.agentDetailsModel = new AgentDetailsModel(
      this.storageService,
      this.agentHubService
    );

    this.agentDetailsModel.queryparamInfo = this.activeRoute.snapshot.params as IQueryParams

    const {agentName, Id} = this.activeRoute.snapshot.params

    this.agentDetailsModel.breadCrumbsAction.breadcrumb.push({
      label: agentName,
      index: 1
    })

    this.agentDetailsModel.updateHeaderOption()
  }
}
