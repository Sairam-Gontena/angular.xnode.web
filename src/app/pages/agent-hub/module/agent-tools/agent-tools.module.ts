import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentSharedModule } from '../../agent-shared.module';
import { AgentToolsRoutingModule } from './agent-tools-routing.module';
import { AgentToolsComponent } from './agent-tools.component';
import { ToolOverviewComponent } from './component/tool-overview/tool-overview.component';


@NgModule({
    declarations: [
        AgentToolsComponent,
        ToolOverviewComponent
    ],
    imports: [
        CommonModule,
        AgentToolsRoutingModule,
        AgentSharedModule
    ],
    exports: [
        ToolOverviewComponent
    ]
})
export class AgentToolsModule { }
