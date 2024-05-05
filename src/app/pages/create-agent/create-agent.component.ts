import { Component } from '@angular/core';
import { CreateAgentModel } from './create-agent.model';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { Location } from '@angular/common';
import { UtilsService } from 'src/app/components/services/utils.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-create-agent',
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.scss'],
})
export class CreateAgentComponent {
  createConfigureDetailObj: any;
  enablePreview: boolean = false;
  manualConfiguration: boolean = false;

  constructor(private router: Router,
    private localStorageService: LocalStorageService,
    private agentHubService: AgentHubService) { }

  ngOnInit() { }

  //create configure header event
  createConfigureheaderEvent(event: any) {
    if (event?.eventType) {
      switch (event.eventType) {
        case 'CREATE':
          let agentHubDetailData: any = this.localStorageService.getItem(StorageKeys.AGENT_HUB_DETAIL);
          this.agentHubService.saveAgentHeaderObj(agentHubDetailData);
          this.manualConfiguration = false
          break;
        case 'PREVIEW':
          this.enablePreview = true;
          break;
        case 'CONFIGURE':
          this.manualConfiguration = true
          break;
        case 'CLOSE':
          this.router.navigate(['agent-playground']);
          break;
        default:
          break;
      }
    }
  }

}
