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
import { CapabilityOverviewComponent } from './module/agent-capability/component/overview/overview.component';
import { PromptOverviewComponent } from './module/agent-prompt/component/prompt-overview/prompt-overview.component';
import { ToolOverviewComponent } from './module/agent-tools/component/tool-overview/tool-overview.component';

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
    switch (eventData.eventName) {
      case 'Agent':

        break;
      case 'Capability':
        if (eventData.eventType === "CREATE") {
          dialogDetail.component = CapabilityOverviewComponent;
          dialogDetail.configDetail.data = {
            componentType: eventData.eventType,
            header: {
              headerText: "Add Capability",
              subHeaderText: "Please enter the details below to add or create capability"
            }
          }
          this.commonDialog(dialogDetail);
        }
        break;
      case 'Topic':
        if (eventData.eventType === "CREATE") {
          dialogDetail.component = TopicOverviewComponent;
          dialogDetail.configDetail.data = {
            componentType: eventData.eventType,
            header: {
              headerText: "Add Topic",
              subHeaderText: "Please enter the details below to add or create topic"
            }
          }
          this.commonDialog(dialogDetail);
        }
        break;
      case 'Prompt':
        if (eventData.eventType === "CREATE") {
          dialogDetail.component = PromptOverviewComponent;
          dialogDetail.configDetail.data = {
            componentType: eventData.eventType,
            header: {
              headerText: "Add Prompt",
              subHeaderText: "Please enter the details below to add or create prompt"
            }
          }
          this.commonDialog(dialogDetail);
        }
        break;
      case 'createModel':
        if (eventData.eventType === "CREATE") {
          dialogDetail.component = ModelOverviewComponent;
          dialogDetail.configDetail.data = {
            componentType: eventData.eventType,
            header: {
              headerText: "Add Model",
              subHeaderText: "Please enter the details below to add a model."
            }
          }
          this.commonDialog(dialogDetail);
        }
        break;
      case 'Tool':
        if (eventData.eventType === "CREATE") {
          dialogDetail.component = ToolOverviewComponent;
          dialogDetail.configDetail.data = {
            componentType: eventData.eventType,
            header: {
              headerText: "Add Tool",
              subHeaderText: "Please enter the details below to add a tool."
            }
          }
          this.commonDialog(dialogDetail);
        }
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

