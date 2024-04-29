import { Component, Input } from '@angular/core';

@Component({
  selector: 'xnode-agent-information',
  templateUrl: './agent-information.component.html',
  styleUrls: ['./agent-information.component.scss']
})
export class AgentInformationComponent {
  @Input() agentInfo: any
}
