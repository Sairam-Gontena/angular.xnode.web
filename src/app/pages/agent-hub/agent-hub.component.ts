import { Component, OnInit } from '@angular/core';
import { AgentHubModel } from './agent-hub.model';

@Component({
  selector: 'xnode-agent-hub',
  templateUrl: './agent-hub.component.html',
  styleUrls: ['./agent-hub.component.scss']
})
export class AgentHubComponent implements OnInit {

  agentHubModel: AgentHubModel;

  ngOnInit() { }
  constructor() {
    this.agentHubModel = new AgentHubModel()
  }

}

