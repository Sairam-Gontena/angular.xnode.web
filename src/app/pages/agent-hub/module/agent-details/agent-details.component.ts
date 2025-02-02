import { Component } from '@angular/core';
import { AgentDetailsModel } from './agent-details.model';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IQueryParams } from './IAgent-details';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.scss']
})
export class AgentDetailsComponent {

  agentDetailsModel: AgentDetailsModel;
  tableHeaderbgColor: string = "#2F353E";
  bgColorRow: any = { oddRowColor: "#2F353E" };

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private activeRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router) {
    this.agentDetailsModel = new AgentDetailsModel(
      this.storageService,
      this.agentHubService,
      this.activeRoute,
      this.utilsService,
      this.router
    );
    this.agentDetailsModel.updateHeaderOption()
  }
}
