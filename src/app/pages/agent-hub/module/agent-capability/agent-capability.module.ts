import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentSharedModule } from '../../agent-shared.module';
import { AgentCapabilityRoutingModule } from './agent-capability-routing.module';
import { AgentCapabilityComponent } from './agent-capability.component';
import { OverviewComponent } from './component/overview/overview.component';



@NgModule({
    declarations: [
        AgentCapabilityComponent,
        OverviewComponent
    ],
    imports: [
        CommonModule,
        AgentCapabilityRoutingModule,
        AgentSharedModule
    ]
})

export class AgentCapabilityModule { }
