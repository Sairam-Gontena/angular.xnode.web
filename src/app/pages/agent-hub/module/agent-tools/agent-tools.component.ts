import { Component } from '@angular/core';

@Component({
  selector: 'xnode-agent-tools',
  templateUrl: './agent-tools.component.html',
  styleUrls: ['./agent-tools.component.scss']
})
export class AgentToolsComponent {
  tabItems: { idx: number; title: string; value: string, identifier: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview', identifier: 'overview' },
  ];
  activeIndex: number = 0;
  constructor() { }
}
