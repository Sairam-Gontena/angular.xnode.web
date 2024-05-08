import { Component } from '@angular/core';

@Component({
  selector: 'xnode-agent-prompt',
  templateUrl: './agent-prompt.component.html',
  styleUrls: ['./agent-prompt.component.scss']
})
export class AgentPromptComponent {
  public topicTabs = [{ title: 'Overview', component: 'promptOverview' },
    // { title: 'Instruction', component: 'promptInstruction' }
  ];

  constructor() { }

  ngOnInit() { }
}
