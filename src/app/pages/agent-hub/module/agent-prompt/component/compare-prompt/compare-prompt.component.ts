import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-compare-prompt',
  templateUrl: './compare-prompt.component.html',
  styleUrls: ['./compare-prompt.component.scss']
})
export class ComparePromptComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<any> = new EventEmitter<any>();
  userInfo: any;
  enableAdvancedOtion = true;
  @Input() promptId = '0ce2593a-2e4b-4172-b744-ae8898e5c480' //f609a8d8-d36b-4e50-9bc6-f601633e481c

  livePromptRecord: any;
  trainingPromptRecord: any;

  public promptTabs = [
    { title: 'Compare Result', component: 'Compare_Result' },
    { title: 'Compare Config', component: 'Compare_Configuration' }
  ];

  constructor(private storageService: LocalStorageService, private utilsService: UtilsService, private agentHubService: AgentHubService) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
  }

  ngOnInit() {
    this.getPrompLiveRecord()
    this.getPrompTrainingRecord()
  }



  getPrompLiveRecord() {
    let urlParam: any = {
      url: ("/agent/prompt_by_id/" + this.promptId)
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.livePromptRecord = response
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

  getPrompTrainingRecord() {
    let urlParam: any = {
      url: ("/agent/prompt_by_id/" + this.promptId)
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.trainingPromptRecord = response
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error?.detail });
        this.utilsService.loadSpinner(false);
      }
    });
  }


  //show and hide advanced Option
  showHideAdvancedOption() {
    this.enableAdvancedOtion = !this.enableAdvancedOtion;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  onClose() {
    this.visibleChange.emit(false);
  }
}
