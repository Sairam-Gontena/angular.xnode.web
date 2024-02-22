import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentHubRoutingModule } from './agent-hub-routing.module';
import { AgentHubComponent } from './agent-hub.component';
import { SharedModule } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [
    AgentHubComponent
  ],
  imports: [
    CommonModule,
    AgentHubRoutingModule,
    TabMenuModule,

    TabViewModule,
    MultiSelectModule,
    DropdownModule,
    SplitButtonModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class AgentHubModule { }
