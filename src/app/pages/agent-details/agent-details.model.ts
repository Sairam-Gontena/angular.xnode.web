import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { BreadCrumbsAction, CapabilitiesTableData, IPaginatorInfo, IQueryParams, ITableDataEntry, ITableInfo } from './IAgent-details';
import dynamicTableColumnData from '../../../assets/json/dynamictabledata.json';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { agentName } from '../agent-hub/agent-hub.constant';
import { AgentHubFormConstant } from 'src/assets/json/agenthub_form_constant';
import { TabViewChangeEvent } from 'primeng/tabview';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/components/services/utils.service';

const InitialPaginatorInfo = {
  page: 0,
  perPage: 10,
  totalPages: 0,
  totalRecords: 0,
};
export class AgentDetailsModel {
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
  paginatorInfo: IPaginatorInfo = { ...InitialPaginatorInfo };
  activeIndex: number = 0;
  userInfo: any;
  headerActionBtnOption = {
    overview: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Agent',
          icon: '',
          command: () => { },
        },
      ],
    },
    agent_instructions: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Agent',
          icon: '',
          command: () => { },
        },
      ],
    },

    capability: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Capability',
          icon: '',
          command: () => { },
        },
      ],
    },
    topic: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Topic',
          icon: '',
          command: () => { },
        },
      ],
    },
    prompt: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Prompt',
          icon: '',
          command: () => {
            this.addPrompt()
          },
        },
      ],
    },

    knowledge: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Knowledge',
          icon: '',
          command: () => { },
        },
      ],
    },

    model: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Model',
          icon: '',
          command: () => { },
        }
      ],
    },

    tool: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Tool',
          icon: '',
          command: () => { },
        }
      ],
    },
  };
  activeHeaderActionBtnOption!: any[];
  breadCrumbsAction: BreadCrumbsAction = {
    isBreadCrumbActive: false,
    breadcrumb: [
      {
        label: 'Agent Hub',
        index: 0,
        path: '/agent-playground'
      },
    ],
    // activeBreadCrumbsItem: "",
  };
  /**Overview Property: Using for showing details of the Agent or related property */
  overviewTabItem = {
    showTab: false,
    activeIndex: 0,
    tabItems: [
      { idx: 0, title: 'Overview', value: 'overview', identifier: 'overview' },
      { idx: 1, title: 'Instructions', value: 'instructions', identifier: 'instruction' }
    ],
    tabSwitchHandler: () => {
      this.viewHandler(this.currentActiveRowData)
    }
  }
  currentActiveRowData: any;
  queryparamInfo!: IQueryParams; // Active query params property
  dynamicFormBindingKeys: any // Define form field.
  overviewInstructionForm: any = {
    enableOverview: false,
    enableInstruction: false,
    overviewInstructionData: ""
  };
  promptModalShow = false;

  isFormEditable = false;

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
  }

  viewHandler(item: any) {
    const activeTabIdentifier = this.tabItems[this.activeIndex].identifier;
    const overViewTabIdentifier = this.overviewTabItem.tabItems[this.overviewTabItem.activeIndex].identifier;
    if (overViewTabIdentifier === "overview") {
      this.overviewInstructionForm.enableOverview = true;
      this.overviewInstructionForm.enableInstruction = false;
    } else if (overViewTabIdentifier === "instruction") {
      this.overviewInstructionForm.enableInstruction = true;
      this.overviewInstructionForm.enableOverview = false;
    }
    this.overviewInstructionForm.overviewInstructionData = item;
    // this.overviewInstructionForm.overviewInstructionData = Object.assign({}, this.overviewInstructionForm.overviewInstructionData);
    this.currentActiveRowData = item;
    this.overviewTabItem.showTab = true;
  }

  goBackBreadCrumbsHandler(event: any) {
    // this.breadCrumbsAction.activeBreadCrumbsItem = ""
    const newItem = this.breadCrumbsAction.breadcrumb;
    const indexToDelete = event.item.index + 1;
    newItem.splice(indexToDelete);
    this.breadCrumbsAction.isBreadCrumbActive = false;

    if(event?.item?.path) {
      this.router.navigate([event.item.path]);
    }

    // Show viewALl button
    // this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;

    this.breadCrumbsAction.breadcrumb = [...newItem];
  }

  onShowDynamicColumnFilter(event: any) {
    if (!event?.value?.length) {
      this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex]?.columns;
    } else {
      this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex].columns?.filter(
        (item) => event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx));
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
      this.columns = dynamicTableColumnData.dynamicTable.AgentHub[this.activeIndex].columns;
      this.paginatorInfo.page = response.page;
      this.paginatorInfo.perPage = response.per_page;
      this.paginatorInfo.totalRecords = response.total_items;
      this.paginatorInfo.totalPages = response.total_pages;
    }
  }

  //making the url param for category
  makeTableParamObj(paginationObj: any) {
    let url: string = "agent/agents/{agent_id}/",
      getID: any = this.activatedRoute.snapshot.paramMap.get('id'),
      urlParam: any = {
        url: url.replace("{agent_id}", getID),
        params: {
          agent_id: getID,
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
        urlParam.url = urlParam.url + "capabilities/";
        break;
      case 3:
        urlParam.url = urlParam.url + "topics/";
        break;
      case 4:
        urlParam.url = urlParam.url + "prompts/";
        break;
      case 5:

        break;
      case 6:
        urlParam.url = urlParam.url + "models/";
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

  // tab event
  onTabSwitchHandler(event: TabViewChangeEvent) {
    let paginatorInfo: IPaginatorInfo = { ...InitialPaginatorInfo };
    let urlParam = this.makeTableParamObj(paginatorInfo);
    this.changeURL(event.index, urlParam);
    this.getAgentDetailByCategory(urlParam);
    this.updateHeaderOption();
  }

  updateHeaderOption() {
    let item = this.tabItems[this.activeIndex];
    if (item.identifier in this.headerActionBtnOption) {
      this.activeHeaderActionBtnOption =
        this.headerActionBtnOption[
          item.identifier as keyof typeof this.headerActionBtnOption
        ].options;
    } else {
      console.error('Invalid identifier:', item.identifier);
      // Handle the error appropriately
    }
  }

  addPrompt() {
    this.promptModalShow = true
  }


  onEditSaveHandler(formData: any) {
    const activeTab = this.tabItems[this.activeIndex].identifier

    if(this.isFormEditable) {
      let urlParam = {
        url: '',
        data: {}
      }
  
      if(activeTab == agentName.prompt) {
        const id = formData?.id

        delete formData?.id
        urlParam.url = `agent/update_prompt/${id}/${formData.version}`
        urlParam.data = formData
      }
  
  
      this.agentHubService.updateData(urlParam).subscribe({
        next: (response: any) => {
          console.log("responseData", response)
        }, error: (error: any) => {
          console.log("responseData", error)
        }
      })
    }






    this.isFormEditable = !this.isFormEditable

  }


}
