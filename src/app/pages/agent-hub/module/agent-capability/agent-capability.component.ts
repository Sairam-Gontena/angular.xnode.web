import { Component } from '@angular/core';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { InitialPaginatorInfo, searchFilterOptions, tableRowActionOptions, tableInfo, agentHeaderActionOptions } from '../../constant/agent-hub';
import { agentName } from '../../agent-hub.constant';
import dynamicTableColumnData from '../../../../../assets/json/dynamictabledata.json';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { TabViewChangeEvent } from 'primeng/tabview';


@Component({
  selector: 'xnode-agent-capability',
  templateUrl: './agent-capability.component.html',
  styleUrls: ['./agent-capability.component.scss']
})
export class AgentCapabilityComponent {
  capabilityTabs: { idx: number; title: string; value: string, component: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview', component: agentName.capability },
    { idx: 1, title: 'Topics', value: 'topic', component: agentName.topic },
    { idx: 2, title: 'Prompts', value: 'prompt_linked_topic', component: agentName.prompt },
    { idx: 3, title: 'Models', value: 'model', component: agentName.model },
    { idx: 4, title: 'Tools', value: 'tool', component: agentName.tool },
  ];
  activeIndex: number = 0; // Active capabilityTab index 
  tableData: any;
  columns: any;
  userInfo: any;
  agentInfo: any; // Capability details
  tableRowActionOptions = tableRowActionOptions // Dynamic Table config
  paginatorInfo = { ...InitialPaginatorInfo }; //Dynamic Table config
  searchFilterOptions: any = { ...searchFilterOptions } // Dynamic Table config
  tableInfo: any = { ...tableInfo }// Dynamic Table config
  headerActionBtnOption = agentHeaderActionOptions;
  agentHubDetail: any;
  tableHeaderbgColor: string = "#2F353E";
  bgColorRow: any = { oddRowColor: "#2F353E" };

  constructor(
    private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);

    this.agentHubDetail = this.agentHubService.getAgentHeader();
    this.updateHeaderOption()
  }


  // get agent detail by category after success
  getAgentDetailByCategorySuccess(response: any) {
    if (response.detail) {
      this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.detail });
    } else if (response.data) {
      this.tableData = response.data
      const identifier = this.capabilityTabs[this.activeIndex].component as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns =
        dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;

      this.paginatorInfo.page = response.page;
      this.paginatorInfo.perPage = response.per_page;
      this.paginatorInfo.totalRecords = response.total_items;
      this.paginatorInfo.totalPages = response.total_pages;
    }
  }

  viewHandler(item: any) {
    if (this.activeIndex > 0) {
      let agentHubDetailObj: any = this.agentHubService.getAgentHeader();
      if (agentHubDetailObj) {
        agentHubDetailObj.showActionButton = true;
        agentHubDetailObj.agentConnectedFlow = true;
        agentHubDetailObj.agentInfo = item;
        this.agentHubService.setAgentHeader(agentHubDetailObj);
        this.agentHubService.saveAgentHeaderObj(agentHubDetailObj);
      }
      this.router.navigate([this.capabilityTabs[this.activeIndex].component, item?.id], { relativeTo: this.activatedRoute });
    }
  }

  // tab event
  onTabSwitchHandler(event: TabViewChangeEvent) {
    if (this.activeIndex > 0) {
      /**
       * Fetch result when activeIndex is > 1
       */
      let paginatorInfo = { ...InitialPaginatorInfo };
      let urlParam = this.makeTableParamObj(paginatorInfo);
      this.changeURL(event.index, urlParam);

      // Empty the list and update the column name
      const identifier = this.capabilityTabs[this.activeIndex].component as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns = dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
      this.tableData = [];
      this.paginatorInfo = { ...InitialPaginatorInfo };


      this.getAgentDetailByCategory(urlParam);

    } else {
      /**
       * Show agent overview/instruction
       */
    }

    this.updateHeaderOption();
  }


  updateHeaderOption() {
    let item = this.capabilityTabs[this.activeIndex];
    if (item.component in this.headerActionBtnOption) {
      this.agentHubDetail.actionButtonOption = this.headerActionBtnOption[item.component as keyof typeof this.headerActionBtnOption].options;
      this.agentHubService.saveAgentHeaderObj(this.agentHubDetail);
    } else {
      console.error('Invalid identifier:', item.component);
      // Handle the error appropriately
    }
  }

  //making the url param for category
  makeTableParamObj(paginationObj: any) {
    let url: string = "/agent/",
      // getID: any = this.activatedRoute.snapshot.paramMap.get('id'),
      urlParam: any = {
        url: url,
        params: {
          // agent_id: getID,
          account_id: this.userInfo.account_id,
          page: paginationObj.page + 1,
          limit: paginationObj.perPage ? paginationObj.perPage : paginationObj.rows
        }
      };
    return urlParam;
  }

  //making url for the category
  changeURL(tabIndex: number, urlParam: any) {
    let capabilityId = this.activatedRoute.snapshot.paramMap.get('id')
    switch (tabIndex) {
      case 1:
        urlParam.url = urlParam.url + "capabilities_topics/" + capabilityId + "/";
        break;
      case 2:
        urlParam.url = urlParam.url + "capabilities_prompts/" + capabilityId + "/";
        break;
      case 3:
        urlParam.url = urlParam.url + "capabilities_model/" + capabilityId + "/";
        break;
      case 4:
        urlParam.url = urlParam.url + "capabilities_tools/" + capabilityId + "/";
        break;
    }
  }

  //get the agent details by catgory
  getAgentDetailByCategory(urlParam: any) {
    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        this.getAgentDetailByCategorySuccess(response);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
      }
    });
  }

  //pagination event for table
  paginatorViewHandler(item: any) {
    let urlParam = this.makeTableParamObj(item);
    this.changeURL(this.activeIndex, urlParam);
    this.getAgentDetailByCategory(urlParam);
  }
}
