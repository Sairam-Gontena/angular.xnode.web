import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import dynamicTableColumnData from './../../../../../../../assets/json/dynamictabledata.json';
import { IPaginatorInfo } from '../../../agent-details/IAgent-details';
import { InitialPaginatorInfo, promptSearchFilterOptions, promptTableRowActionOptions } from 'src/app/pages/agent-hub/constant/agent-hub';

@Component({
  selector: 'xnode-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent {
  promptObj: any = {
    topicId: "",
    currentUser: "any",
    tableData: new Array(),
    columns: dynamicTableColumnData.dynamicTable.AgentHub.prompt.columns,
    paginatorInfo: { ...InitialPaginatorInfo },
    promptTableRowActionOptions: promptTableRowActionOptions,
    promptSearchFilterOptions: promptSearchFilterOptions
  }

  constructor(private activatedRoute: ActivatedRoute,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.promptObj.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.promptObj.topicId = this.activatedRoute.snapshot.paramMap.get('id');
    let urlParam = this.makeTableParamObj(this.promptObj.InitialPaginatorInfo);
    this.getPromptDataByTopic(urlParam); //get prompt details by topic ID
  }

  //get prompts data by topic ID
  getPromptDataByTopic(urlParam: any) {
    this.utilsService.loadSpinner(true);
    this.agentHubService.getPromptDataByTopic(urlParam).subscribe({
      next: (response: any) => {
        if (response) {

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
      url: "/agent/prompts/" + this.promptObj.topicId,
      params: {
        account_id: this.promptObj.currentUser.account_id,
        topic_id: this.promptObj.topicId,
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
