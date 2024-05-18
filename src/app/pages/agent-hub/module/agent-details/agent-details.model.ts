import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { CapabilitiesTableData, IPaginatorInfo, IQueryParams, ITableDataEntry, ITableInfo } from './IAgent-details';
import dynamicTableColumnData from '../../../../../assets/json/dynamictabledata.json';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { agentName } from '../../../agent-hub/agent-hub.constant';
import { TabViewChangeEvent } from 'primeng/tabview';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/components/services/utils.service';
import { InitialPaginatorInfo, agentHeaderActionOptions } from '../../constant/agent-hub';

export class AgentDetailsModel {
  agentHubDetail: any;
  tabItems: { idx: number; title: string; value: string, identifier: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview', identifier: 'overview' },
    { idx: 1, title: 'Agent Instructions', value: 'agent_instructions', identifier: 'agent_instructions' },

    {
      idx: 2,
      title: 'Capabilities',
      value: 'capabilities_linked_agents',
      identifier: agentName.capability
    },
    { idx: 3, title: 'Topics', value: 'topic', identifier: agentName.topic },
    {
      idx: 4,
      title: 'Prompts',
      value: 'prompt_linked_topic',
      identifier: agentName.prompt
    },
    {
      idx: 5,
      title: 'Knowledge',
      value: 'knowledge',
      identifier: agentName.knowledge,
    },
    { idx: 6, title: 'Models', value: 'model', identifier: agentName.model },
    { idx: 7, title: 'Tools', value: 'tool', identifier: agentName.tool },
  ];
  tableData!: ITableDataEntry[] | CapabilitiesTableData[];
  columns: any; // Define the type of columns based on the actual data structure
  tableInfo: ITableInfo = {
    delete_action: false,
    export_action: false,
    name: 'Notification List',
    search_input: true,
  };
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
  };
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
  tableRowActionOptions = [{
    label: 'View', icon: '',
    command: (event: any) => {
      console.info(event, 'event');
    }
  }, {
    label: 'Duplicate', icon: '',
    command: (event: any) => {
      console.info(event, 'event');
    }
  }, {
    label: 'Archieve', icon: '',
    command: (event: any) => {
      console.info(event, 'event');
    }
  }, {
    label: 'Delete', icon: '',
    command: (event: any) => {
      console.info(event, 'event');
    }
  }];
  paginatorInfo: IPaginatorInfo = { ...InitialPaginatorInfo };
  activeIndex: number = 0;
  userInfo: any;
  headerActionBtnOption = agentHeaderActionOptions;

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
    this.getAgentDetailsById();
    this.agentHubDetail = this.agentHubService.getAgentHeader();
  }

  viewHandler(item: any) {
    if (this.activeIndex > 1) {
      let agentHubDetailObj: any = this.agentHubService.getAgentHeader();
      if (agentHubDetailObj) {
        agentHubDetailObj.showActionButton = true;
        agentHubDetailObj.agentConnectedFlow = true;
        agentHubDetailObj.agentInfo = item;
        this.agentHubService.setAgentHeader(agentHubDetailObj);
        this.agentHubService.saveAgentHeaderObj(agentHubDetailObj);
      }
      this.router.navigate([this.tabItems[this.activeIndex].identifier, item?.id], { relativeTo: this.activatedRoute });
    }
  }

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
      // this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex].columns?.filter(
      //   (item) => event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx));
    }
  }

  //pagination event for table
  paginatorViewHandler(item: any) {
    let urlParam = this.makeTableParamObj(item);
    this.changeURL(this.activeIndex, urlParam);
    this.getAgentDetailByCategory(urlParam);
  }

  // get agent detail by category after success
  getAgentDetailByCategorySuccess(response: any) {
    if (response.detail) {
      this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.detail });
    } else if (response.data) {
      this.tableData = response.data as CapabilitiesTableData[];
      // this.columns = dynamicTableColumnData.dynamicTable.AgentHub[this.activeIndex].columns;
      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns = dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
      this.paginatorInfo.page = response.page;
      this.paginatorInfo.perPage = response.per_page;
      this.paginatorInfo.totalRecords = response.total_items;
      this.paginatorInfo.totalPages = response.total_pages;
    }
  }

  //making the url param for category
  makeTableParamObj(paginationObj: any) {
    let url: string = "/agent/agents/{agent_id}/",
      getID: any = this.activatedRoute.snapshot.paramMap.get('id'),
      urlParam: any = {
        url: url.replace("{agent_id}", getID),
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
    switch (tabIndex) {
      case 2:
        urlParam.url = urlParam.url + "/capabilities/";
        break;
      case 3:
        urlParam.url = urlParam.url + "/topics/";
        break;
      case 4:
        urlParam.url = urlParam.url + "/prompts/";
        break;
      case 5:

        break;
      case 6:
        urlParam.url = urlParam.url + "/models/";
        break;
    }
  }

  //get the agent details by catgory
  getAgentDetailByCategory(urlParam: any) {
    this.utilsService.loadSpinner(true);
    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        this.getAgentDetailByCategorySuccess(response);
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
      }
    });
  }

  //  get the agent details by Id
  getAgentDetailsById() {
    let url: string = "/agent/agent_by_id/",
      getID: any = this.activatedRoute.snapshot.paramMap.get('id'),
      urlParam: any = {
        url: url + getID,
        params: {}
      }

    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        // this.getAgentDetailByCategorySuccess(response);
        this.agentHubDetail.agentConnectedFlow = response ? true : false;
        this.agentHubDetail.agentInfo = response;
        this.agentHubDetail.showActionButton = true;
        this.agentHubService.saveAgentHeaderObj(this.agentHubDetail);

        // this.breadCrumbsAction.breadcrumb = [...this.breadCrumbsAction.breadcrumb,
        // { label: response?.name, index: this.breadCrumbsAction.breadcrumb.length }]
        console.info(response, "response")
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
      }
    });
  }

  // tab event
  onTabSwitchHandler(event: TabViewChangeEvent) {
    if (this.activeIndex > 1) {
      let paginatorInfo: IPaginatorInfo = { ...InitialPaginatorInfo };
      let urlParam = this.makeTableParamObj(paginatorInfo);
      this.changeURL(event.index, urlParam);
      this.getAgentDetailByCategory(urlParam);
    } else {
      /**
       * Show agent overview/instruction
       */
    }
    this.updateHeaderOption();
  }

  updateHeaderOption() {
    let item = this.tabItems[this.activeIndex];
    if (item.identifier in this.headerActionBtnOption) {
      this.agentHubDetail.actionButtonOption = this.headerActionBtnOption[item.identifier as keyof typeof this.headerActionBtnOption].options;
      this.agentHubService.saveAgentHeaderObj(this.agentHubDetail);
    } else {
      console.error('Invalid identifier:', item.identifier);
      // Handle the error appropriately
    }
  }
}
