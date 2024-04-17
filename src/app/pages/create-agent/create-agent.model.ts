import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { IPaginatorInfo, ITableDataEntry, ITableInfo } from './ICreate-agent';
import dynamicTableColumnData from '../../../assets/json/dynamictabledata.json';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { Location } from '@angular/common';
import { TabViewChangeEvent } from 'primeng/tabview';
import { UtilsService } from 'src/app/components/services/utils.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';

const InitialPaginatorInfo = {
  page: 1,
  perPage: 10,
  totalPages: 0,
  totalRecords: 0,
};
export class CreateAgentModel {
  // tabItems: { idx: number; title: string; value: string }[] = [
  //   { idx: 0, title: 'Overview', value: 'overview' },
  //   { idx: 1, title: 'Agent Instructions', value: 'agen_instructions' },

  //   {
  //     idx: 2,
  //     title: 'Capabilities',
  //     value: 'capabilities_linked_agents',
  //   },
  //   { idx: 3, title: 'Topics', value: 'topic' },
  //   {
  //     idx: 4,
  //     title: 'Prompts',
  //     value: 'prompt_linked_topic',
  //   },
  //   {
  //     idx: 5,
  //     title: 'Knowledge',
  //     value: 'knowledge',
  //   },
  //   { idx: 6, title: 'Models', value: 'model' },
  //   { idx: 7, title: 'Tools', value: 'tool' },
  // ];

  tabItems: Array<any> = [{
    index: 0,
    header: { enableIcon: false, title: 'Overview' },
    tabContent: { id: 'overview' }
  }, {
    index: 1,
    header: { enableIcon: false, title: 'Agent Instructions' },
    tabContent: { id: 'instructions' }
  }, {
    index: 2,
    header: { enableIcon: false, title: 'Capabilities' },
    url: "agent/capabilities_linked_agents/{account_id}",
    tabContent: { id: 'capabilities' }
  }, {
    index: 3,
    header: { enableIcon: false, title: 'Topics' },
    url: "agent/topic/{account_id}",
    tabContent: { id: 'topic' }
  }, {
    index: 4,
    header: { enableIcon: false, title: 'Prompts' },
    url: "agent/prompt_linked_topic/{account_id}",
    tabContent: { id: 'prompts' }
  }, {
    index: 5,
    header: { enableIcon: false, title: 'Knowledge' },
    url: "agent/knowledge/{account_id}",
    tabContent: { id: 'knowledge' }
  }, {
    index: 6,
    header: { enableIcon: false, title: 'Models' },
    url: "agent/model/{account_id}",
    tabContent: { id: 'model' }
  }, {
    index: 7,
    header: { enableIcon: false, title: 'Tools' },
    url: "agent/tool/{account_id}",
    tabContent: { id: 'tool' }
  }]

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
  // overviewForm!: FormGroup;
  // instructionForm!: FormGroup;
  // instructionOption = [{ name: "General Instructions", value: "general_instruction" },
  // { name: "Capability Specific Instructions", value: "capability_specific_instruction" }];
  // enableGeneralInstruction: boolean = true;
  // categoryNameCountArr: Array<any> = [{ categoryIcon: "", categoryName: "Capabilities", count: "2" },
  // { categoryIcon: "", categoryName: "Topics", count: "4" },
  // { categoryIcon: "", categoryName: "Prompts", count: "8" },
  // { categoryIcon: "", categoryName: "Knowledge", count: "2" },
  // { categoryIcon: "", categoryName: "Models", count: "1" },
  // { categoryIcon: "", categoryName: "Tools", count: "2" }]

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private location: Location,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
    //overview form
    // this.overviewForm = this.formBuilder.group({
    //   description: [''],
    //   tags: ['']
    // })
    // //instruction form
    // this.instructionForm = this.formBuilder.group({
    //   name: [''],
    //   role: [''],
    //   description: [''],
    //   instruction: [''],
    //   general_task: [''],
    //   specific_instruction: [''],
    //   missing_information: [''],
    //   answer_format: ['']
    // });
    // this.instructionForm.patchValue({
    //   instruction: this.instructionOption[0]
    // });
  }

  goBackHandler(): void {
    this.location.back()
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
        dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns?.filter((item) =>
          event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx));

      // this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex].columns?.filter((item) =>
      //   event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx));
    }
  }

  switchHeaders(event: TabViewChangeEvent) {
    if (event.index > 1) {
      this.getAllAgentList();
    }
  }

  // //on change instruction dropdown event
  // onChangeInstruction(event: DropdownChangeEvent) {
  //   if (event.value && event.value.value === "general_instruction") {
  //     this.enableGeneralInstruction = true;
  //   } else if (event.value && event.value.value === "capability_specific_instruction") {
  //     this.enableGeneralInstruction = false;
  //   }
  // }

  // //overview form submit
  // onOverviewSubmit() {
  //   console.log(this.overviewForm.value);
  // }

  // //instruction form submit
  // onInstructionSubmit() {
  //   debugger
  //   console.log(this.instructionForm.value);
  // }

  //pagination event for table
  paginatorViewHandler(item: any) {
    let urlParam = this.makeTableParamObj(item);
    this.getAgentDetailByAccountID(urlParam);
  }

  //making the url param for category
  makeTableParamObj(paginationObj: any) {
    let url: string = this.tabItems[this.activeIndex].url,
      urlParam: any = {
        url: url.replace("{account_id}", this.userInfo.account_id),
        params: {
          page: paginationObj.page,
          page_size: paginationObj.perPage ? paginationObj.perPage : paginationObj.rows
        }
      };
    return urlParam;
  }

  // get agent detail by account ID after success
  getAgentDetailByAccountIDSuccess(response: any) {
    if (response && response.data) {
      this.tableData = response.data as ITableDataEntry[];
      this.paginatorInfo.page = response.page;
      this.paginatorInfo.perPage = response.per_page;
      this.paginatorInfo.totalRecords = response.total_items;
      this.paginatorInfo.totalPages = response.total_pages;
      return;
    }
    this.tableData = new Array();
    this.paginatorInfo = { ...InitialPaginatorInfo };
    this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
  }

  //get the agent details by account ID
  getAgentDetailByAccountID(urlParam: any) {
    this.agentHubService.getAgentDetailByAccountID(urlParam).subscribe({
      next: (response: any) => {
        this.getAgentDetailByAccountIDSuccess(response);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
      }
    });
  }

  //get agent list by account ID
  getAllAgentList({ endpoint = '' } = {}) {
    // this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex]?.columns;
    const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
    this.columns =
      dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    let paginatorInfo: IPaginatorInfo = { ...InitialPaginatorInfo };
    let urlParam = this.makeTableParamObj(paginatorInfo);
    try {
      this.getAgentDetailByAccountID(urlParam);
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  }
}
