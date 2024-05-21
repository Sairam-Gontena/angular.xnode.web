import { Component } from '@angular/core';
import { IDropdownItem, IPaginatorInfo, ITableDataEntry, ITableInfo } from '../../IAgent-hub';
import { Constant, agentName } from '../../agent-hub.constant';
import dynamicTableColumnData from './../../../../../assets/json/dynamictabledata.json';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { UtilsService } from 'src/app/components/services/utils.service';
import { agentHeaderActionOptions, agentHubDetail, agentRecordDataType } from '../../constant/agent-hub';
import { TabViewChangeEvent } from 'primeng/tabview';

const InitialPaginatorInfo = {
  page: 1,
  perPage: 10,
  totalPages: 0,
  totalRecords: 0,
};

@Component({
  selector: 'xnode-agent-hub-detail',
  templateUrl: './agent-hub-detail.component.html',
  styleUrls: ['./agent-hub-detail.component.scss']
})
export class AgentHubDetailComponent {
  agentHubDetail: any;
  tableInfo: ITableInfo = {
    delete_action: false,
    export_action: false,
    name: 'Notification List',
    search_input: true,
    showAgentDataType: true
  };
  searchFilterOptions = {
    showFilterOption: true,
    filter: false,
    showToggleAll: false,
    showHeader: false,
    options: [
      {
        idx: 0,
        header: 'All',
      },
      {
        idx: 1,
        header: 'My Agents',
      },
    ],
    placeholder: 'All',
    optionLabel: 'header',
    styleClass: 'custom-multiselect',
  };
  tableRowActionOptions = [
    {
      label: 'View',
      icon: '',
      command: (event: any) => {
        console.log(event, 'event');
      },
    },
    {
      label: 'Duplicate',
      icon: '',
      command: (event: any) => {
        console.log(event, 'event');
      },
    },
    {
      label: 'Archieve',
      icon: '',
      command: (event: any) => {
        console.log(event, 'event');
      },
    },
    {
      label: 'Delete',
      icon: '',
      command: (event: any) => {
        console.log(event, 'event');
      },
    },
  ];
  agentTabItemDropdown: IDropdownItem[] = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: () => {
        // this.update();
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => {
        // this.delete();
      },
    },
    // Additional dropdown items...
  ];
  public tabItems: { idx: number; title: string; value: string; identifier: string }[];
  public tabFilterOptions = {
    // showFilterOption: true,
    filter: false,
    showToggleAll: false,
    showHeader: false,
    options: [] as any[],
    showIconOnly: true,
    hamburgerIconUrl: '../../../assets/agent-hub/menu-hamnburger.svg',
    placeholder: '',
    optionLabel: 'title',
    styleClass: 'menu-hamburger mt-1',
    changeHandler: this.onFilterTabItem.bind(this),
  };
  allAvailableTabItems = [
    { idx: 0, title: 'Agents', value: 'agents', identifier: agentName.agent },
    {
      idx: 1,
      title: 'Capabilities',
      value: 'capabilitys', // Will update endpoint once backend is deployed
      identifier: agentName.capability,
    },
    { idx: 2, title: 'Topics', value: 'topic', identifier: agentName.topic },
    {
      idx: 3,
      title: 'Prompts',
      value: 'prompt',
      identifier: agentName.prompt,
    },
    {
      idx: 4,
      title: 'Knowledge',
      value: 'resource/resources-by-user',
      identifier: agentName.knowledge,
    },
    { idx: 5, title: 'Models', value: 'model', identifier: agentName.model },
    { idx: 6, title: 'Tools', value: 'tool', identifier: agentName.tool },
  ];
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
  userInfo: any;
  columns: any; // Define the type of columns based on the actual data structure
  activeIndex: number;
  paginatorInfo: IPaginatorInfo = { ...InitialPaginatorInfo };
  tableData!: ITableDataEntry[];
  headerActionBtnOption = agentHeaderActionOptions;
  activeHeaderActionBtnOption!: any[];
  agentDataType: string = agentRecordDataType.live;
  recordType = agentRecordDataType //live/training/archieve

  viewAll = {
    showButton: true,
    clickHandler: this.OnbreabCrumbsClickHandler.bind(this),
  };
  tableHeaderbgColor: string = "#2F353E";
  bgColorRow: any = { oddRowColor: "#2F353E" };

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService,
    private router: Router) {
    this.activeIndex = 0;
    this.tabItems = this.allAvailableTabItems;
    this.tabFilterOptions.options = this.tabItems;
    const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
    this.columns = dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    this.showColumnFilterOption.options = this.columns?.map((item: any) => {
      return {
        idx: item.idx,
        header: item.header,
      };
    });
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
    if (!this.activeIndex) {
      this.agentHubService.setAgentHeader(JSON.parse(JSON.stringify(agentHubDetail)));
      this.agentHubService.saveAgentHeaderObj(JSON.parse(JSON.stringify(agentHubDetail)));
    }
    this.agentHubDetail = this.agentHubService.getAgentHeader();
  }

  ngOnInit() {
    this.getAllAgentList();
  }

  onShowDynamicColumnFilter(event: any) {
    if (!event?.value?.length) {
      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns =
        dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    } else {
      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns = dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns?.filter((item) =>
        event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx));
    }
  }

  onFilterTabItem(event: any) {
    if (!event?.value?.length) {
      this.tabItems = this.tabFilterOptions.options;
    } else {
      this.tabItems = this.tabFilterOptions.options.filter((item) =>
        event?.value?.some(
          (valItem: { idx: number }) => valItem.idx === item.idx
        )
      );
    }
    this.getAllAgentList();
  }

  async getAllAgentList({ endpoint = '' } = {}) {
    const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
    this.columns = dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    endpoint = endpoint ? endpoint : this.tabItems[this.activeIndex].value;
    this.tableData = [];
    this.paginatorInfo = { ...InitialPaginatorInfo };
    // try {
    //   this.utilsService.loadSpinner(true);
    //   const response = await this.agentHubService.getAllAgent({
    //     accountId: this.userInfo.account_id,
    //     endpoint: endpoint,
    //     status: this.agentDataType,
    //     page: this.paginatorInfo.page,
    //     page_size: this.paginatorInfo.perPage,
    //   });
    //   this.tableData = response.data.data as ITableDataEntry[];
    //   this.paginatorInfo.page = response.data.page;
    //   this.paginatorInfo.perPage = response.data.per_page;
    //   this.paginatorInfo.totalRecords = response.data.total_items;
    //   this.paginatorInfo.totalPages = response.data.total_pages;
    //   this.utilsService.loadSpinner(false);
    // } catch (error) {
    //   this.utilsService.loadSpinner(false);
    //   console.error('Error fetching agent list:', error);
    // }


    let url: string = `/agent/${endpoint}/${this.userInfo.account_id}`,
      urlParam: any = {
        url: url,
        params: {
          // accountId: this.userInfo.account_id,
          // endpoint: endpoint,
          status: this.agentDataType,
          page: this.paginatorInfo.page,
          page_size: this.paginatorInfo.perPage
        }
      }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getAllAgent(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.tableData = response.data as ITableDataEntry[];
          this.paginatorInfo.page = response.page;
          this.paginatorInfo.perPage = response.per_page;
          this.paginatorInfo.totalRecords = response.total_items;
          this.paginatorInfo.totalPages = response.total_pages;
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
      }
    })
  }

  agentTabDropDownHandler() {
    if (this.activeIndex != 0) {
      this.activeIndex = 0;
      this.getAllAgentList();
    }
  }

  OnbreabCrumbsClickHandler(event: any) {
    let item = this.tabItems[this.activeIndex];
    // this.breadCrumbsAction.isBreadCrumbActive = true;
    // const newPayload = {
    //   label: item.title,
    //   index: this.breadCrumbsAction.breadcrumb.length,
    // };
    // this.breadCrumbsAction.breadcrumb = [...this.breadCrumbsAction.breadcrumb, newPayload];
    if (item.identifier in this.headerActionBtnOption) {
      this.agentHubDetail.actionButtonOption = this.headerActionBtnOption[item.identifier as keyof typeof this.headerActionBtnOption].options;
      this.agentHubService.saveAgentHeaderObj(this.agentHubDetail);
    } else {
      console.error('Invalid identifier:', item.identifier);
      // Handle the error appropriately
    }
    // Don't show viewAll button
    // this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;
    this.getAllAgentList({ endpoint: item.value });
  }

  viewHandler(item: any) {
    let agentHubDetailObj: any = this.agentHubService.getAgentHeader();
    if (agentHubDetailObj) {
      agentHubDetailObj.showActionButton = true;
      agentHubDetailObj.agentConnectedFlow = true;
      agentHubDetailObj.agentInfo = item;
      this.agentHubService.setAgentHeader(agentHubDetailObj);
      this.agentHubService.saveAgentHeaderObj(agentHubDetailObj);
    }
    this.router.navigate(['/agent-playground', this.tabItems[this.activeIndex].identifier, item?.id]);
  }

  onTabSwitchHandler(event: TabViewChangeEvent) {

    this.agentDataType = this.recordType.live

    this.getAllAgentList()
  }

  setAgentDataType(event: any) {
    this.agentDataType = event
    this.getAllAgentList()
  }


  //pagination event for table
  paginatorViewHandler(item: any) {
    // let urlParam = this.makeTableParamObj(item);
    // this.changeURL(this.activeIndex, urlParam);
    // this.getAgentDetailByCategory(urlParam);
  }
}
