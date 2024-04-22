import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentHubDetailRoutingModule } from './agent-hub-detail-routing.module';
import { AgentHubDetailComponent } from './agent-hub-detail.component';
import { AgentSharedModule } from '../../agent-shared.module';


@NgModule({
  declarations: [
    AgentHubDetailComponent
  ],
  imports: [
    CommonModule,
    AgentHubDetailRoutingModule,
    AgentSharedModule
  ]
})
export class AgentHubDetailModule { }
