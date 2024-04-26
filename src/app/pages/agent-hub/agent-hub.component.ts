import { Component, HostListener, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constant } from './agent-hub.constant';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { agentHubDetail, dialogConfigDetail } from './constant/agent-hub';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TopicOverviewComponent } from './module/agent-topic/component/overview/overview.component';
import { ModelOverviewComponent } from './module/agent-model/component/overview/overview.component';

@Component({
  selector: 'xnode-agent-hub',
  templateUrl: './agent-hub.component.html',
  styleUrls: ['./agent-hub.component.scss']
})
export class AgentHubComponent implements OnInit {
  agentHubDetailObj: any;
  dynamicDialogRef: DynamicDialogRef | undefined;
  dialogConfigDetail: any = dialogConfigDetail;

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private dialogService: DialogService,
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
        this.agentHubService.setAgentHeader(response);
        this.agentHubDetailObj = Object.assign({}, this.agentHubDetailObj);
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

  //common dialog
  commonDialog(dialogDetail: any) {
    this.dynamicDialogRef = this.dialogService.open(dialogDetail.component, dialogDetail.configDetail);
    //onclose dialog event
    this.dynamicDialogRef.onClose.subscribe((data: any) => {
      if (data.eventType === "CLOSE") {
        // close event
      }
      if (data.eventType === "CANCEL") {
        // cancel event
      }
    });
    this.dynamicDialogRef.onMaximize.subscribe((value: any) => {
    });
  }

  continueCreateActionButton(eventData: any) {
    let dialogDetail: any = { component: '', configDetail: this.dialogConfigDetail };
    switch (eventData.eventType) {
      case 'createAgent':

        break;
      case 'createTopic':
        dialogDetail.component = TopicOverviewComponent;
        dialogDetail.configDetail.data = {
          componentType: "CREATE",
          header: {
            headerText: "Add Topic",
            subHeaderText: "Please enter the details below to add or create topic"
          }
        }
        // dialogDetail.configDetail.templates.header = '<h1>Add Topic</h1><p>Venkat</p>';
        this.commonDialog(dialogDetail);
        break;
      case 'createModel':
        dialogDetail.component = ModelOverviewComponent;
        dialogDetail.configDetail.header = 'Add Model';
        this.commonDialog(dialogDetail);
        break;
      default:
        break;
    }
  }

  //agent header Event
  agentheaderEvent(event: any) {
    if (event?.eventType) {
      switch (event.eventType) {
        case 'createAgent':
          this.createAgentHandler();
          break;
        case 'breadcrum':
          this.goBackBreadCrumbsHandler(event.eventData);
          break;
        case 'actionButton':
          this.continueCreateActionButton(event.eventData)
          break;
        default:
          break;
      }
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (Object.keys(this.agentHubDetailObj.agentInfo).length) {
      this.storageService.saveItem(StorageKeys.AGENT_HUB_DETAIL, this.agentHubDetailObj);
    }
  }

}

