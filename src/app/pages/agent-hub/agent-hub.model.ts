/**
 * Represents the model for the Agent Hub page.
 */
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import dynamicTableColumnData from '../../../assets/json/dynamictabledata.json';
import {
  IDropdownItem,
  IPaginatorInfo,
  ITableDataEntry,
  ITableInfo,
} from './IAgent-hub';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { Constant, agentName } from './agent-hub.constant';
import { Router } from '@angular/router';

const InitialPaginatorInfo = {
  page: 1,
  perPage: 10,
  totalPages: 0,
  totalRecords: 0,
};
export class AgentHubModel {
  // tableData!: any;
  tableInfo: ITableInfo = {
    delete_action: false,
    export_action: false,
    name: 'Notification List',
    search_input: true,
  };

  allAvailableTabItems = [
    { idx: 0, title: 'Agents', value: 'agents', identifier: agentName.agent },
    {
      idx: 1,
      title: 'Capabilities',
      value: 'capabilities_linked_agents',
      identifier: agentName.capability,
    },
    { idx: 2, title: 'Topics', value: 'topic', identifier: agentName.topic },
    {
      idx: 3,
      title: 'Prompts',
      value: 'prompt_linked_topic',
      identifier: agentName.prompt,
    },
    {
      idx: 4,
      title: 'Knowledge',
      value: 'knowledge',
      identifier: agentName.knowledge,
    },
    { idx: 5, title: 'Models', value: 'model', identifier: agentName.model },
    { idx: 6, title: 'Tools', value: 'tool', identifier: agentName.tool },
  ];

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

  tabFilterOptions = {
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

  headerActionBtnOption = {
    agent: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Agent',
          icon: '',
          command: () => { },
        },
        {
          label: 'Import Agent',
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
        {
          label: 'Import Capability',
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
        {
          label: 'Import Topic',
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
          command: () => { },
        },
        {
          label: 'Import Prompt',
          icon: '',
          command: () => { },
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
        {
          label: 'Import Knowledge',
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
        },
        {
          label: 'Import Model',
          icon: '',
          command: () => { },
        },
      ],
    },

    tool: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add Tool',
          icon: '',
          command: () => { },
        },
        {
          label: 'Import Tool',
          icon: '',
          command: () => { },
        },
      ],
    },
  };

  activeHeaderActionBtnOption!: any[];

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

  columns: any; // Define the type of columns based on the actual data structure
  activeIndex: number;
  tabItems: { idx: number; title: string; value: string; identifier: string }[];
  tableData!: ITableDataEntry[];
  //   acitveHeaderActionBtnOption

  viewAll = {
    showButton: !this.breadCrumbsAction.isBreadCrumbActive,
    clickHandler: this.OnbreabCrumbsClickHandler.bind(this),
  };

  paginatorInfo: IPaginatorInfo = { ...InitialPaginatorInfo };
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
  userInfo: any;
  statsItem = Constant.stats;

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private router: Router
  ) {
    this.activeIndex = 0;

    /**
     * Get the column name for filter option
     */

    this.tabItems = this.allAvailableTabItems;

    this.tabFilterOptions.options = this.tabItems;

    const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
    this.columns =
      dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;

    this.showColumnFilterOption.options = this.columns?.map((item: any) => {
      return {
        idx: item.idx,
        header: item.header,
      };
    });

    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
  }

  /**
   * Methods will be define from here
   */
  test(event: any): void {
    console.log('hello', event);
    // this.activeIndex = 0;
  }

  agentTabDropDownHandler() {
    if (this.activeIndex != 0) {
      this.activeIndex = 0;
      this.getAllAgentList();
    }
  }

  onShowDynamicColumnFilter(event: any) {
    if (!event?.value?.length) {
      // this.columns =
      //   dynamicTableColumnData?.dynamicTable?.AgentHub[
      //     this.activeIndex
      //   ]?.columns;

      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns =
        dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    } else {

      const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
      this.columns = dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns?.filter((item) =>
        event?.value?.some(
          (valItem: { idx: number }) => valItem.idx === item.idx
        )
      );
      // this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[
      //   this.activeIndex
      // ].columns?.filter((item) =>
      //   event?.value?.some(
      //     (valItem: { idx: number }) => valItem.idx === item.idx
      //   )
      // );
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

  OnbreabCrumbsClickHandler(event: any) {
    let item = this.tabItems[this.activeIndex];
    this.breadCrumbsAction.isBreadCrumbActive = true;
    const newPayload = {
      label: item.title,
      index: this.breadCrumbsAction.breadcrumb.length,
    };
    this.breadCrumbsAction.breadcrumb = [
      ...this.breadCrumbsAction.breadcrumb,
      newPayload,
    ];

    // if(item.identifier in this.headerActionBtnOption) {
    //     this.activeHeaderActionBtnOption = this.headerActionBtnOption[item.identifier].options
    // }

    if (item.identifier in this.headerActionBtnOption) {
      this.activeHeaderActionBtnOption =
        this.headerActionBtnOption[
          item.identifier as keyof typeof this.headerActionBtnOption
        ].options;
    } else {
      console.error('Invalid identifier:', item.identifier);
      // Handle the error appropriately
    }

    // Don't show viewAll button

    this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;

    this.getAllAgentList({ endpoint: item.value });
  }

  goBackBreadCrumbsHandler(event: any) {
    // this.breadCrumbsAction.activeBreadCrumbsItem = ""
    const newItem = this.breadCrumbsAction.breadcrumb;
    const indexToDelete = event.item.index + 1;
    newItem.splice(indexToDelete);
    this.breadCrumbsAction.isBreadCrumbActive = false;

    // Show viewALl button
    this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;

    this.breadCrumbsAction.breadcrumb = [...newItem];
  }

  createAgentHandler() {
    this.router.navigate(['/create-agent']);
  }

  viewHandler(item: any) {
    // For now let's make view for agent only,
    if (this.activeIndex == 0) {
      this.router.navigate(['/agent-playground', this.tabItems[this.activeIndex].identifier, item?.id]);
    }
  }

  /**
   * NOTE: Async Operation
   */

  async getAllAgentList({ endpoint = '' } = {}) {
    // this.columns =
    //   dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex]?.columns;

    const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
    this.columns =
      dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    endpoint = endpoint ? endpoint : this.tabItems[this.activeIndex].value;
    this.tableData = [];
    this.paginatorInfo = { ...InitialPaginatorInfo };
    try {
      const response = await this.agentHubService.getAllAgent({
        accountId: this.userInfo.account_id,
        endpoint: endpoint,
        page: this.paginatorInfo.page,
        page_size: this.paginatorInfo.perPage,
      });
      this.tableData = response.data.data as ITableDataEntry[];
      this.paginatorInfo.page = response.data.page;
      this.paginatorInfo.perPage = response.data.per_page;
      this.paginatorInfo.totalRecords = response.data.total_items;
      this.paginatorInfo.totalPages = response.data.total_pages;

      // this.tableData = [
      //     {
      //       id: 1,
      //       name: 'Agent 1',
      //       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      //       status: 'Active',
      //       created_by: 'John Doe'
      //     },
      //     {
      //       id: 2,
      //       name: 'Agent 2',
      //       description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      //       status: 'Inactive',
      //       created_by: 'Jane Doe'
      //     },
      //     {
      //       id: 3,
      //       name: 'Agent 3',
      //       description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      //       status: 'Active',
      //       created_by: 'John Smith'
      //     },
      //     {
      //       id: 4,
      //       name: 'Agent 4',
      //       description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      //       status: 'Active',
      //       created_by: 'Alice Johnson'
      //     },
      //     {
      //       id: 5,
      //       name: 'Agent 5',
      //       description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      //       status: 'Inactive',
      //       created_by: 'Bob Williams'
      //     },
      //     {
      //       id: 6,
      //       name: 'Agent 6',
      //       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      //       status: 'Active',
      //       created_by: 'Emily Davis'
      //     },
      //     {
      //       id: 7,
      //       name: 'Agent 7',
      //       description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      //       status: 'Inactive',
      //       created_by: 'Frank Wilson'
      //     },
      //     {
      //       id: 8,
      //       name: 'Agent 8',
      //       description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      //       status: 'Active',
      //       created_by: 'Grace Anderson'
      //     },
      //     {
      //       id: 9,
      //       name: 'Agent 9',
      //       description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      //       status: 'Inactive',
      //       created_by: 'Henry Martinez'
      //     },
      //     {
      //       id: 10,
      //       name: 'Agent 10',
      //       description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      //       status: 'Active',
      //       created_by: 'Isabella Garcia'
      //     }
      //   ];
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  }

  async getAgentCount() {
    try {
      let query = {
        account_id: this.userInfo.account_id,
      };
      const response = await this.agentHubService.getAgentCount({
        endpoint: 'agent',
        query,
      });

      this.statsItem.forEach((element: any) => {
        element.count = response.data[element.key];
      });
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  }
}
