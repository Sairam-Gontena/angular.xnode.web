import { Component, HostListener, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from './agent-hub.constant';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { agentHubDetail } from './constant/agent-hub';

@Component({
  selector: 'xnode-agent-hub',
  templateUrl: './agent-hub.component.html',
  styleUrls: ['./agent-hub.component.scss']
})
export class AgentHubComponent implements OnInit {
  agentHubDetailObj: any;

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private router: Router) {
    let agentHubDetailData: any = this.agentHubService.getAgentHeader() ? this.agentHubService.getAgentHeader() : this.storageService.getItem(StorageKeys.AGENT_HUB_DETAIL);
    if (agentHubDetailData && Object.keys(agentHubDetailData.agentInfo).length) {
      this.agentHubService.saveAgentHeaderObj(agentHubDetailData);
      this.agentHubService.setAgentHeader(agentHubDetailData);
      this.agentHubDetailObj = agentHubDetailData;
      this.storageService.removeItem(StorageKeys.AGENT_HUB_DETAIL);
    } else {
      this.agentHubDetailObj = JSON.parse(JSON.stringify(agentHubDetail));
      this.agentHubService.setAgentHeader(this.agentHubDetailObj);
    }
  }

  ngOnInit() {
    this.agentHubService.changeAgentHeaderObj().subscribe((response: any) => {
      if (response) {
        this.agentHubDetailObj = response;
      }
    });
    this.getAgentCount();
  }

  async getAgentCount() {
    let userInfo: any = this.storageService.getItem(StorageKeys.CurrentUser);
    try {
      let query = { account_id: userInfo.account_id };
      const response = await this.agentHubService.getAgentCount({ endpoint: 'agent', query });
      this.agentHubDetailObj?.statsItem?.forEach((element: any) => {
        element.count = response.data[element.key];
      });
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  }

  goBackBreadCrumbsHandler(event: any) {
    // this.breadCrumbsAction.activeBreadCrumbsItem = ""
    const newItem = this.agentHubDetailObj.breadCrumbsAction.breadcrumb;
    const indexToDelete = event.item.index + 1;
    newItem.splice(indexToDelete);
    this.agentHubDetailObj.breadCrumbsAction.isBreadCrumbActive = false;
    // Show viewALl button
    // this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;
    this.agentHubDetailObj.breadCrumbsAction.breadcrumb = [...newItem];
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

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (Object.keys(this.agentHubDetailObj.agentInfo).length) {
      this.storageService.saveItem(StorageKeys.AGENT_HUB_DETAIL, this.agentHubDetailObj);
    }
  }

}

