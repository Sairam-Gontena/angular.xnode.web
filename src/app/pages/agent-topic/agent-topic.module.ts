import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentTopicRoutingModule } from './agent-topic-routing.module';
import { AgentTopicComponent } from './agent-topic.component';


@NgModule({
  declarations: [
    AgentTopicComponent
  ],
  imports: [
    CommonModule,
    AgentTopicRoutingModule
  ]
})
export class AgentTopicModule { }
