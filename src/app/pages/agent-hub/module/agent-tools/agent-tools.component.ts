import { Component, OnInit } from '@angular/core';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { agentHeaderActionOptions } from '../../constant/agent-hub';

@Component({
  selector: 'xnode-agent-tools',
  templateUrl: './agent-tools.component.html',
  styleUrls: ['./agent-tools.component.scss']
})
export class AgentToolsComponent implements OnInit {
  tabItems: { idx: number; title: string; value: string, identifier: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview', identifier: 'tool' },
  ];

  headerActionBtnOption = agentHeaderActionOptions;
  agentHubDetail: any;
  activeIndex: number = 0;
  constructor(private agentHubService: AgentHubService) { }

  ngOnInit() {
    this.agentHubDetail = this.agentHubService.getAgentHeader();
    this.updateHeaderOption()
  }

  updateHeaderOption() {
    let item = this.tabItems[0]
    if (item.identifier in this.headerActionBtnOption) {
      this.agentHubDetail.actionButtonOption = this.headerActionBtnOption[item.identifier as keyof typeof this.headerActionBtnOption].options;
      this.agentHubService.saveAgentHeaderObj(this.agentHubDetail);
    } else {
      console.error('Invalid identifier:', item.identifier);
      // Handle the error appropriately
    }
  }
}
