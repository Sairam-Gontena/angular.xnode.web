import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentTopicRoutingModule } from './agent-topic-routing.module';
import { AgentTopicComponent } from './agent-topic.component';
import { AgentSharedModule } from '../../agent-shared.module';


@NgModule({
  declarations: [
    AgentTopicComponent
  ],
  imports: [
    CommonModule,
    AgentTopicRoutingModule,
    AgentSharedModule
  ]
})

export class AgentTopicModule { }
