import { Component } from '@angular/core';

@Component({
  selector: 'xnode-agent-model',
  templateUrl: './agent-model.component.html',
  styleUrls: ['./agent-model.component.scss']
})
export class AgentModelComponent {
  public modelTabs = [{ title: 'Overview', component: 'modelOverview' },
  { title: 'Configuration', component: 'modelConfiguration' }];

  constructor() { }

  ngOnInit() { }

}
