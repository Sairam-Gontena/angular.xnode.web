import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentTopicRoutingModule } from './agent-topic-routing.module';
import { AgentTopicComponent } from './agent-topic.component';
import { AgentSharedModule } from '../../agent-shared.module';
import { TopicOverviewComponent } from './component/overview/overview.component';
import { PromptComponent } from './component/prompt/prompt.component';


@NgModule({
  declarations: [
    AgentTopicComponent,
    TopicOverviewComponent,
    PromptComponent
  ],
  imports: [
    CommonModule,
    AgentTopicRoutingModule,
    AgentSharedModule
  ],
  exports: [
    TopicOverviewComponent
  ]
})

export class AgentTopicModule { }
