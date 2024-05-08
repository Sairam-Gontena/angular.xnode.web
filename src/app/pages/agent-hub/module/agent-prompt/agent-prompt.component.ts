import { Component, OnInit } from '@angular/core';
import { agentHeaderActionOptions } from '../../constant/agent-hub';
import { AgentHubService } from 'src/app/api/agent-hub.service';

@Component({
  selector: 'xnode-agent-prompt',
  templateUrl: './agent-prompt.component.html',
  styleUrls: ['./agent-prompt.component.scss']
})
export class AgentPromptComponent implements OnInit {
  public promptTabs = [{ title: 'Overview', component: 'prompt' },
    // { title: 'Instruction', component: 'promptInstruction' }
  ];

  headerActionBtnOption = agentHeaderActionOptions;
  agentHubDetail: any;

  constructor(private agentHubService: AgentHubService) { }

  ngOnInit() {
    this.agentHubDetail = this.agentHubService.getAgentHeader();
    this.updateHeaderOption()
  }


  updateHeaderOption() {
    let item = this.promptTabs[0]
    if (item.component in this.headerActionBtnOption) {
      this.agentHubDetail.actionButtonOption = this.headerActionBtnOption[item.component as keyof typeof this.headerActionBtnOption].options;
      this.agentHubService.saveAgentHeaderObj(this.agentHubDetail);
    } else {
      console.error('Invalid identifier:', item.component);
      // Handle the error appropriately
    }
  }
}
