import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentModelRoutingModule } from './agent-model-routing.module';
import { AgentModelComponent } from './agent-model.component';
import { ModelOverviewComponent } from './component/overview/overview.component';
import { ConfigurationComponent } from './component/configuration/configuration.component';
import { AgentSharedModule } from '../../agent-shared.module';


@NgModule({
  declarations: [
    AgentModelComponent,
    ModelOverviewComponent,
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    AgentModelRoutingModule,
    AgentSharedModule
  ]
})
export class AgentModelModule { }
