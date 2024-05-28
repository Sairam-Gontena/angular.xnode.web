import { Component } from '@angular/core';
import { IDropdownItem, IPaginatorInfo, ITableInfo } from '../../IAgent-hub';
import { Constant, actionButton, agentName } from '../../agent-hub.constant';
import dynamicTableColumnData from './../../../../../assets/json/dynamictabledata.json';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { UtilsService } from 'src/app/components/services/utils.service';
import { agentHeaderActionOptions, agentHubDetail, agentRecordDataType } from '../../constant/agent-hub';
import { TabViewChangeEvent } from 'primeng/tabview';
import { DropdownChangeEvent } from 'primeng/dropdown';

const InitialPaginatorInfo = {
  page: 0,
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
      identifier: actionButton.view
    },
    {
      label: 'Duplicate',
      identifier: actionButton.duplicate
    },
    {
      label: 'Archieve',
      identifier: actionButton.archieve
    }
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
      value: 'resources-by-user',
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
  tableData!: any;
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
    // this.getAllAgentList();
    this.getAgentDetailByCategory();
    this.updateHeaderOption();
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
    // this.getAllAgentList();
    this.getAgentDetailByCategory()
  }

  async getAllAgentList(urlParam: any) {
    // const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
    // this.columns = dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    // endpoint = endpoint ? endpoint : this.tabItems[this.activeIndex].value;
    // this.tableData = [];
    // this.paginatorInfo = { ...InitialPaginatorInfo };

    // let url: string = `/agent/${endpoint}/${this.userInfo.account_id}`,
    //   urlParam: any = {
    //     url: url,
    //     params: {
    //       // accountId: this.userInfo.account_id,
    //       // endpoint: endpoint,
    //       status: this.agentDataType,
    //       page: this.paginatorInfo.page,
    //       page_size: this.paginatorInfo.perPage
    //     }
    //   }

    if (this.activeIndex == 4) {
      this.utilsService.loadSpinner(true);
      this.agentHubService.getResouceData(urlParam).subscribe({
        next: (response: any) => {
          if (response) {
            //data formatting
            response?.data?.map((item: any) => {
              item.tags = [...item.content.tags, ...item.content.tags, ...item.content.tags, ...item.content.tags],
                item.shared_by = item?.createdBy?.displayName
              item.type = item?.fileName?.split('.')[1]?.toUpperCase()
            })
            this.tableData = response?.data
            this.paginatorInfo.page = response?.page;
            this.paginatorInfo.perPage = response?.per_page;
            this.paginatorInfo.totalRecords = response?.total_items;
            this.paginatorInfo.totalPages = response?.total_pages;
          } else if (response?.detail) {
            this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
          }
          this.utilsService.loadSpinner(false);
        }, error: (error: any) => {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
          this.utilsService.loadSpinner(false);
        }
      })
    } else {
      this.utilsService.loadSpinner(true);
      this.agentHubService.getAllAgent(urlParam).subscribe({
        next: (response: any) => {
          if (response) {
            this.tableData = response.data;
            this.paginatorInfo.page = response.page;
            this.paginatorInfo.perPage = response.per_page;
            this.paginatorInfo.totalRecords = response.total_items;
            this.paginatorInfo.totalPages = response.total_pages;





            // Delete it, For Testing purpose
            // if (this.activeIndex == 1) {
            //   response.data.map((item: any) => {
            //     item.linked_agent = ["Navi conversation", "Testing Navi", "Brd Gen", "Specs Gen"]
            //   })

            //   this.tableData = response.data
            // }
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
  }

  // agentTabDropDownHandler() {
  //   if (this.activeIndex != 0) {
  //     this.activeIndex = 0;
  //     this.getAllAgentList();
  //   }
  // }

  OnbreabCrumbsClickHandler(event: any) {
    // let item = this.tabItems[this.activeIndex];
    // // this.breadCrumbsAction.isBreadCrumbActive = true;
    // // const newPayload = {
    // //   label: item.title,
    // //   index: this.breadCrumbsAction.breadcrumb.length,
    // // };
    // // this.breadCrumbsAction.breadcrumb = [...this.breadCrumbsAction.breadcrumb, newPayload];
    // if (item.identifier in this.headerActionBtnOption) {
    //   this.agentHubDetail.actionButtonOption = this.headerActionBtnOption[item.identifier as keyof typeof this.headerActionBtnOption].options;
    //   this.agentHubService.saveAgentHeaderObj(this.agentHubDetail);
    // } else {
    //   console.error('Invalid identifier:', item.identifier);
    //   // Handle the error appropriately
    // }
    // // Don't show viewAll button
    // // this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;
    // this.getAllAgentList({ endpoint: item.value });
  }

  viewHandler(item: any) {
    if (this.activeIndex != 4) {
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
  }

  onTabSwitchHandler(event: TabViewChangeEvent) {
    this.agentDataType = this.recordType.live;
    // this.getAllAgentList()

    this.getAgentDetailByCategory()
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

  setAgentDataType(event: any) {
    this.agentDataType = event
    // this.getAllAgentList()
    this.getAgentDetailByCategory()
  }


  //pagination event for table
  paginatorViewHandler(item: any) {
    // let urlParam = this.makeTableParamObj(item);
    this.getAgentDetailByCategory(item);
  }


  tableRowActionHandler(event: any) {
    switch (event?.value?.identifier) {
      case actionButton.view:
        console.log(actionButton.view)
        this.viewHandler(event?.row)
        break;
      case actionButton.duplicate:
        console.log(actionButton.duplicate);
        this.createClone(event?.row)
        break;
      case actionButton.archieve:
        console.log(actionButton.archieve);
        break;
      default:
        break;
    }

  }

  createClone(item: any) {
    let urlParam = {
      url: '',
      params: {
        id: item?.id
      }
    }

    if (this.activeIndex == 0) {
      // agemt clone
      urlParam.url = 'agent/clone_agent'
    } else if (this.activeIndex == 1) {
      // capability clone
      urlParam.url = 'agent/clone_capability'
    } else if (this.activeIndex == 2) {
      // topic clone
      urlParam.url = 'agent/clone_topic'
    } else if (this.activeIndex == 3) {
      //clone topic
      urlParam.url = "agent/clone_prompt"
    }

    this.utilsService.loadSpinner(true);
    this.agentHubService.createDuplicate(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          console.log(response, "Clone Successfully")
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error?.detail });
        this.utilsService.loadSpinner(false);
      }
    })
  }


  //making the url param for category
  makeTableParamObj(paginationObj: any) {
    let endpoint = this.tabItems[this.activeIndex].value;
    let url: string = `/agent/${endpoint}/${this.userInfo.account_id}`,
      urlParam: any = {
        url: url,
        params: {
          // accountId: this.userInfo.account_id,
          // endpoint: endpoint,
          status: this.agentDataType,
          page: paginationObj.page + 1,
          page_size: paginationObj.perPage ? paginationObj.perPage : paginationObj.rows
        }
      }


    if (this.activeIndex == 4) {
      urlParam.url = `/resource/${endpoint}`
      urlParam.params.accountId = this.userInfo.account_id
      urlParam.params.userId = this.userInfo.user_id
    }

    return urlParam;
  }

  getAgentDetailByCategory(paginator = null) {
    let paginatorInfo;
    if (!paginator) {
      paginatorInfo = { ...InitialPaginatorInfo };
    } else {
      paginatorInfo = paginator
    }
    let urlParam = this.makeTableParamObj(paginatorInfo)
    this.getAllAgentList(urlParam)
  }
}
