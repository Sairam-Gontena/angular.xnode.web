import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { IPaginatorInfo, ITableDataEntry, ITableInfo } from './IAgent-details';
import dynamicTableColumnData from '../../../assets/json/dynamictabledata.json';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

const InitialPaginatorInfo = {
  page: 1,
  perPage: 10,
  totalPages: 0,
  totalRecords: 0,
};
export class AgentDetailsModel {
  tabItems: { idx: number; title: string; value: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview' },
    { idx: 1, title: 'Agent Instructions', value: 'agen_instructions' },

    {
      idx: 2,
      title: 'Capabilities',
      value: 'capabilities_linked_agents',
    },
    { idx: 3, title: 'Topics', value: 'topic' },
    {
      idx: 4,
      title: 'Prompts',
      value: 'prompt_linked_topic',
    },
    {
      idx: 5,
      title: 'Knowledge',
      value: 'knowledge',
    },
    { idx: 6, title: 'Models', value: 'model' },
    { idx: 7, title: 'Tools', value: 'tool' },
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

  constructor(
    private storageService: LocalStorageService,
    private agentHubService: AgentHubService, 
  ) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
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

  async getAllAgentList({ endpoint = '' } = {}) {
    if (this.activeIndex > 1) {
      this.columns =
        dynamicTableColumnData?.dynamicTable?.AgentHub[
          this.activeIndex
        ]?.columns;
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
      } catch (error) {
        console.error('Error fetching agent list:', error);
      }
    }
  }
}
