import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentSharedModule } from '../../agent-shared.module';
import { AgentCapabilityRoutingModule } from './agent-capability-routing.module';
import { AgentCapabilityComponent } from './agent-capability.component';
import { CapabilityOverviewComponent } from './component/overview/overview.component';



@NgModule({
    declarations: [
        AgentCapabilityComponent,
        CapabilityOverviewComponent
    ],
    imports: [
        CommonModule,
        AgentCapabilityRoutingModule,
        AgentSharedModule
    ],
    exports: [
        CapabilityOverviewComponent
    ]
})

export class AgentCapabilityModule { }
