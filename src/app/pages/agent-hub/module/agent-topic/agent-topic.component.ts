import { Component } from '@angular/core';

@Component({
  selector: 'xnode-agent-topic',
  templateUrl: './agent-topic.component.html',
  styleUrls: ['./agent-topic.component.scss']
})
export class AgentTopicComponent {
  public topicTabs = [{ title: 'Overview', component: 'topicOverview' },
  { title: 'Prompts', component: 'topicPrompt' }];

  constructor() { }

  ngOnInit() { }

}
