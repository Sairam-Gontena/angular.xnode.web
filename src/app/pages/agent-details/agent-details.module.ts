import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { TabViewModule } from 'primeng/tabview';
import { AgentDetailsRoutingModule } from './agent-details-routing.module';
import { AgentDetailsComponent } from './agent-details.component';

@NgModule({
  declarations: [
    AgentDetailsComponent
  ],
  imports: [
    CommonModule,
    AgentDetailsRoutingModule,
    TabMenuModule,

    TabViewModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class AgentDetailsModule { }
