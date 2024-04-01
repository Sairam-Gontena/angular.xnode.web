import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { IPaginatorInfo, IQueryParams, ITableDataEntry, ITableInfo } from './IAgent-details';
import dynamicTableColumnData from '../../../assets/json/dynamictabledata.json';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { agentName } from '../agent-hub/agent-hub.constant';
import { AgentHubFormConstant } from 'src/assets/json/agenthub_form_constant';

const InitialPaginatorInfo = {
  page: 1,
  perPage: 10,
  totalPages: 0,
  totalRecords: 0,
};
export class AgentDetailsModel {
  constructor(
    private storageService: LocalStorageService,
    private agentHubService: AgentHubService, 
  ) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
  }

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

  tableData!: ITableDataEntry[];
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
          command: () => {},
        },
      ],
    },
    agent_instructions: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Agent',
          icon: '',
          command: () => {},
        },
      ],
    },

    capability: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Capability',
          icon: '',
          command: () => {},
        },
      ],
    },
    topic: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Topic',
          icon: '',
          command: () => {},
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
            this.deleteKarnaHai()
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
          command: () => {},
        },
      ],
    },

    model: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Model',
          icon: '',
          command: () => {},
        }
      ],
    },

    tool: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Tool',
          icon: '',
          command: () => {},
        }
      ],
    },
  };
  activeHeaderActionBtnOption!: any[];
  breadCrumbsAction = {
    isBreadCrumbActive: false,
    breadcrumb: [
      {
        label: 'Agent Hub',
        index: 0,
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


  viewHandler(item: any) {
    /**
     * Hide TabView.
     * Show New Tab.
     * store currentActiveRowData
     */

    //  Let's define the form field.

    const activeTabIdentifier = this.tabItems[this.activeIndex].identifier
    const overViewTabIdentifier = this.overviewTabItem.tabItems[this.overviewTabItem.activeIndex].identifier
    this.dynamicFormBindingKeys = AgentHubFormConstant[activeTabIdentifier][overViewTabIdentifier]


    this.currentActiveRowData = item
    this.overviewTabItem.showTab = true
  }

  goBackBreadCrumbsHandler(event: any) {
    // this.breadCrumbsAction.activeBreadCrumbsItem = ""
    const newItem = this.breadCrumbsAction.breadcrumb;
    const indexToDelete = event.item.index + 1;
    newItem.splice(indexToDelete);
    this.breadCrumbsAction.isBreadCrumbActive = false;

    // Show viewALl button
    // this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;

    this.breadCrumbsAction.breadcrumb = [...newItem];
  }
  onShowDynamicColumnFilter(event: any) {
    if (!event?.value?.length) {
      this.columns =
        dynamicTableColumnData?.dynamicTable?.AgentHub[
          this.activeIndex
        ]?.columns;
    } else {
      this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[
        this.activeIndex
      ].columns?.filter((item) =>
        event?.value?.some(
          (valItem: { idx: number }) => valItem.idx === item.idx
        )
      );
    }
  }

  // async getAllAgentList({ endpoint = '' } = {}) {
  //   if (this.activeIndex > 1) {
  //     this.columns =
  //       dynamicTableColumnData?.dynamicTable?.AgentHub[
  //         this.activeIndex
  //       ]?.columns;
  //     endpoint = endpoint ? endpoint : this.tabItems[this.activeIndex].value;
  //     this.tableData = [];
  //     this.paginatorInfo = { ...InitialPaginatorInfo };
  //     try {
  //       const response = await this.agentHubService.getAllAgent({
  //         accountId: this.userInfo.account_id,
  //         endpoint: endpoint,
  //         page: this.paginatorInfo.page,
  //         page_size: this.paginatorInfo.perPage,
  //       });
  //       this.tableData = response.data.data as ITableDataEntry[];
  //       this.paginatorInfo.page = response.data.page;
  //       this.paginatorInfo.perPage = response.data.per_page;
  //       this.paginatorInfo.totalRecords = response.data.total_items;
  //       this.paginatorInfo.totalPages = response.data.total_pages;
  //     } catch (error) {
  //       console.error('Error fetching agent list:', error);
  //     }
  //   }
  // }

  async getAgentDetails() {
    
  }


  async onTabSwitchHandler(){
    // NOTE: Update function Name, Don't use this function, I have taken this function for development purpose from agent-hub.
    // await this.getAllAgentList()


    /**
     * Let's update the action button option.
     */

    this.updateHeaderOption()
  }

  updateHeaderOption(){
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





  

  show = false;

  deleteKarnaHai() {
    this.show = true
  }


}
