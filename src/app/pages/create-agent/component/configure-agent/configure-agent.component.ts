import { Component } from '@angular/core';
import { agentName } from 'src/app/pages/agent-hub/agent-hub.constant';
import { searchFilterOptions, tableRowActionOptions, tableInfo } from '../../../agent-hub/constant/agent-hub';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import dynamicTableColumnData from '../../../../../assets/json/dynamictabledata.json';
import { TabViewChangeEvent } from 'primeng/tabview';


const InitialPaginatorInfo = {
  page: 1,
  perPage: 10,
  totalPages: 0,
  totalRecords: 0,
};

@Component({
  selector: 'xnode-configure-agent',
  templateUrl: './configure-agent.component.html',
  styleUrls: ['./configure-agent.component.scss']
})
export class ConfigureAgentComponent {
  agentHubDetail: any;
  tabItems: { idx: number; title: string; value: string, identifier: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview', identifier: 'overview' },
    { idx: 1, title: 'Agent Instructions', value: 'agent_instructions', identifier: 'agent_instructions' },

    {
      idx: 2,
      title: 'Capabilities',
      value: 'capabilities_linked_agents',
      identifier: agentName.capability,
    },
    { idx: 3, title: 'Topics', value: 'topic', identifier: agentName.topic },
    {
      idx: 4,
      title: 'Prompts',
      value: 'prompt',
      identifier: agentName.prompt,
    },
    {
      idx: 5,
      title: 'Knowledge',
      value: 'knowledge',
      identifier: agentName.knowledge,
    },
    { idx: 6, title: 'Models', value: 'model', identifier: agentName.model },
    { idx: 7, title: 'Tools', value: 'tool', identifier: agentName.tool }
  ];
  tableData!: any;
  columns: any; // Define the type of columns based on the actual data structure
  tableInfo = { ...tableInfo }// Dynamic Table config
  searchFilterOptions = {
    showFilterOption: true,
    filter: false,
    showToggleAll: false,
    showHeader: false,
    options: [{ idx: 0, header: 'All' },
    { idx: 1, header: 'My Agents' }],
    placeholder: 'All',
    optionLabel: 'header',
    styleClass: 'custom-multiselect',
  }; // Dynamic Table config

  showColumnFilterOption = {
    showFilterOption: true,
    filter: false,
    showToggleAll: false,
    showHeader: false,
    options: [],
    placeholder: 'All',
    optionLabel: 'header',
    styleClass: 'showColumnFilterOption',
    changeHandler: this.onShowDynamicColumnFilter.bind(this),
  };
  tableRowActionOptions = tableRowActionOptions // Dynamic Table config
  paginatorInfo = { ...InitialPaginatorInfo };
  activeIndex: number = 0;
  userInfo: any;
  // headerActionBtnOption = agentHeaderActionOptions;
  viewTableData: { [key: string]: { viewData: boolean; Id: string } } = {
    [agentName.capability]: {
      viewData: false,
      Id: ''
    }
  }

  showDynamicTable = true

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
    // this.agentHubDetail = this.agentHubService.getAgentHeader();
  }

  viewHandler(item: any) {
    if (this.activeIndex > 1) {
      // let agentHubDetailObj: any = this.agentHubService.getAgentHeader();
      // if (agentHubDetailObj) {
      //   agentHubDetailObj.showActionButton = true;
      //   agentHubDetailObj.agentConnectedFlow = true;
      //   agentHubDetailObj.agentInfo = item;
      //   this.agentHubService.setAgentHeader(agentHubDetailObj);
      //   this.agentHubService.saveAgentHeaderObj(agentHubDetailObj);
      // }
      // this.router.navigate([this.tabItems[this.activeIndex].identifier, item?.id], { relativeTo: this.activatedRoute });

      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;

      this.viewTableData[identifier] = {
        viewData: true,
        Id: item.id
      }
      this.showDynamicTable = false
    }
  }

  // NOTE: Will move this function to service later as It is duplication of code
  onShowDynamicColumnFilter(event: any) {
    if (!event?.value?.length) {
      // this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex]?.columns;
      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns =
        dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    } else {
      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns =
        dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns?.filter(
          (item) => event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx));
    }
  }


  paginatorViewHandler(event: any) {

  }


  async getAllAgentList({ endpoint = '' } = {}) {
    if (this.activeIndex > 1) {

      /**
       * Update the Columns Name.
       * Empty the table data
       * Update the Pagination Information
       */
      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns = dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
      endpoint = endpoint ? endpoint : this.tabItems[this.activeIndex].value;
      this.tableData = [];
      this.paginatorInfo = { ...InitialPaginatorInfo };

      /**
       * Fetch the data of active tabs
       */
      try {
        this.utilsService.loadSpinner(true);
        const response = await this.agentHubService.getAllAgent({
          accountId: this.userInfo.account_id,
          endpoint: endpoint,
          page: this.paginatorInfo.page,
          page_size: this.paginatorInfo.perPage,
        });
        this.tableData = response.data.data;
        this.paginatorInfo.page = response.data.page;
        this.paginatorInfo.perPage = response.data.per_page;
        this.paginatorInfo.totalRecords = response.data.total_items;
        this.paginatorInfo.totalPages = response.data.total_pages;
        this.utilsService.loadSpinner(false);
      } catch (error) {
        this.utilsService.loadSpinner(false);
        console.error('Error fetching agent list:', error);
      }
    } else {
      /**
         * Show agent overview/instruction
         */
    }
  }

  // tab event
  onTabSwitchHandler(event: TabViewChangeEvent) {
    this.goBackHandler()
    if (this.activeIndex > 1) {
      this.getAllAgentList();
    } else {
      /**
       * Show agent overview/instruction
       */
    }
    this.updateHeaderOption();
  }

  updateHeaderOption() {
    let item = this.tabItems[this.activeIndex];
    // if (item.identifier in this.headerActionBtnOption) {
    //   this.agentHubDetail.actionButtonOption = this.headerActionBtnOption[item.identifier as keyof typeof this.headerActionBtnOption].options;
    //   this.agentHubService.saveAgentHeaderObj(this.agentHubDetail);
    // } else {
    //   console.error('Invalid identifier:', item.identifier);
    //   // Handle the error appropriately
    // }
  }

  goBackHandler() {
    const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;

    if (identifier in this.viewTableData) {
      this.viewTableData[identifier].viewData = false
    }
    this.showDynamicTable = true
  }
}
