import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import dynamicTableColumnData from './../../../../../../../assets/json/dynamictabledata.json';
import { IPaginatorInfo } from '../../../agent-details/IAgent-details';
import { InitialPaginatorInfo, searchFilterOptions, tableRowActionOptions } from 'src/app/pages/agent-hub/constant/agent-hub';

@Component({
  selector: 'xnode-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent {
  promptObj: any = {
    topicId: "",
    currentUser: "",
    tableData: new Array(),
    columns: dynamicTableColumnData.dynamicTable.AgentHub.prompt.columns,
    paginatorInfo: { ...InitialPaginatorInfo },
    promptTableRowActionOptions: tableRowActionOptions,
    promptSearchFilterOptions: searchFilterOptions,
    tableInfo: {
      delete_action: false,
      export_action: false,
      name: 'Notification List',
      search_input: true,
    },
    showColumnFilterOption: {
      showFilterOption: true,
      filter: false,
      showToggleAll: false,
      showHeader: false,
      options: [],
      placeholder: 'All',
      optionLabel: 'header',
      styleClass: 'showColumnFilterOption',
      changeHandler: this.onShowDynamicColumnFilter.bind(this),
    }
  }

  constructor(private activatedRoute: ActivatedRoute,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.promptObj.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.promptObj.topicId = this.activatedRoute.snapshot.paramMap.get('id');
    let urlParam = this.makeTableParamObj(this.promptObj.paginatorInfo);
    this.getPromptDataByTopic(urlParam); //get prompt details by topic ID
  }


  onShowDynamicColumnFilter(event: any) {
    debugger
    dynamicTableColumnData.dynamicTable.AgentHub.prompt.columns
    // if (!event?.value?.length) {
    //   // this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex]?.columns;
    //   const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
    //   this.columns =
    //     dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns;
    // } else {
    //   const identifier = this.tabItems[this.activeIndex].identifier as keyof typeof dynamicTableColumnData.dynamicTable.AgentHub;
    //   this.columns =
    //     dynamicTableColumnData.dynamicTable.AgentHub[identifier].columns?.filter(
    //       (item) => event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx));
    //   // this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex].columns?.filter(
    //   //   (item) => event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx));
    // }
  }

  //get prompts data by topic ID
  getPromptDataByTopic(urlParam: any) {
    this.utilsService.loadSpinner(true);
    this.agentHubService.getPromptDataByTopic(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.promptObj.tableData = response?.data;
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
      }
    });
  }

  viewHandler(item: any) {
  }

  //making the url param for category
  makeTableParamObj(paginationObj: any) {
    let urlParam: any = {
      url: "/agent/prompt_topic/" + this.promptObj.currentUser.account_id,
      params: {
        page: paginationObj.page + 1,
        limit: paginationObj.perPage ? paginationObj.perPage : paginationObj.rows
      }
    };
    return urlParam;
  }

  //pagination event for table
  paginatorViewHandler(item: any) {
    let urlParam = this.makeTableParamObj(item);
    this.getPromptDataByTopic(urlParam);
  }

}
