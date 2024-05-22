import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { TabViewModule } from 'primeng/tabview';
import { AgentDetailsRoutingModule } from './agent-details-routing.module';
import { AgentDetailsComponent } from './agent-details.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { AgentSharedModule } from '../../agent-shared.module';
import { AgentOverviewComponent } from './component/agent-overview/agent-overview.component';

@NgModule({
  declarations: [
    AgentDetailsComponent,
    AgentOverviewComponent
  ],
  imports: [
    CommonModule,
    AgentDetailsRoutingModule,
    TabMenuModule,
    TabViewModule,
    MultiSelectModule,
    DropdownModule,
    SplitButtonModule,
    ButtonModule,
    SharedModule,
    AgentSharedModule
  ],
  exports: [AgentOverviewComponent]
})
export class AgentDetailsModule { }
