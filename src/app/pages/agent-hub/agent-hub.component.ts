import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { Router } from '@angular/router';
import { Constant } from './agent-hub.constant';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-agent-hub',
  templateUrl: './agent-hub.component.html',
  styleUrls: ['./agent-hub.component.scss']
})
export class AgentHubComponent implements OnInit {
  agentHubObj = {
    statsItem: Constant.stats,
    breadCrumbsAction: {
      isBreadCrumbActive: false,
      breadcrumb: [{ label: 'Agent Hub', index: 0 }],
      // activeBreadCrumbsItem: "",
    }
  }

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private router: Router) { }

  ngOnInit() {
    this.getAgentCount();
  }

  async getAgentCount() {
    let userInfo: any = this.storageService.getItem(StorageKeys.CurrentUser);
    try {
      let query = { account_id: userInfo.account_id };
      const response = await this.agentHubService.getAgentCount({ endpoint: 'agent', query });
      this.agentHubObj.statsItem?.forEach((element: any) => {
        element.count = response.data[element.key];
      });
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  }

  goBackBreadCrumbsHandler(event: any) {
    // this.breadCrumbsAction.activeBreadCrumbsItem = ""
    const newItem = this.agentHubObj.breadCrumbsAction.breadcrumb;
    const indexToDelete = event.item.index + 1;
    newItem.splice(indexToDelete);
    this.agentHubObj.breadCrumbsAction.isBreadCrumbActive = false;
    // Show viewALl button
    // this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;
    this.agentHubObj.breadCrumbsAction.breadcrumb = [...newItem];
  }

  createAgentHandler() {
    this.router.navigate(['/create-agent']);
  }

  //agent header Event
  agentheaderEvent(event: any) {
    if (event.eventType === "createAgent") {
      this.createAgentHandler();
    } else if (event.eventType === "breadcrum") {
      this.goBackBreadCrumbsHandler(event.data);
    }
  }


}

