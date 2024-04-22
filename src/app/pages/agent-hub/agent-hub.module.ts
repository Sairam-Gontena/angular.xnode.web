import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentHubRoutingModule } from './agent-hub-routing.module';
import { AgentHubComponent } from './agent-hub.component';
import { SharedModule } from 'primeng/api';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { AgentSharedModule } from './agent-shared.module';

@NgModule({
  declarations: [
    AgentHubComponent
  ],
  imports: [
    CommonModule,
    AgentHubRoutingModule,
    AgentSharedModule
  ]
})
export class AgentHubModule { }
