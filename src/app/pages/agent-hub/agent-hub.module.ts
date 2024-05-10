import { NgModule } from '@angular/core';
import { AgentHubRoutingModule } from './agent-hub-routing.module';
import { AgentHubComponent } from './agent-hub.component';
import { AgentSharedModule } from './agent-shared.module';

@NgModule({
  declarations: [
    AgentHubComponent
  ],
  imports: [
    AgentHubRoutingModule,
    AgentSharedModule
  ]
})
export class AgentHubModule { }
