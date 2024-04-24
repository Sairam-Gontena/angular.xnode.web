import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentTopicRoutingModule } from './agent-topic-routing.module';
import { AgentTopicComponent } from './agent-topic.component';
import { AgentSharedModule } from '../../agent-shared.module';
import { OverviewComponent } from './component/overview/overview.component';
import { PromptComponent } from './component/prompt/prompt.component';


@NgModule({
  declarations: [
    AgentTopicComponent,
    OverviewComponent,
    PromptComponent
  ],
  imports: [
    CommonModule,
    AgentTopicRoutingModule,
    AgentSharedModule
  ]
})

export class AgentTopicModule { }
