import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentSharedModule } from '../../agent-shared.module';
import { AgentPromptComponent } from './agent-prompt.component';
import { AgentPromptRoutingModule } from './agent-prompt-routing.module';
import { PromptOverviewComponent } from './component/prompt-overview/prompt-overview.component';


@NgModule({
    declarations: [
        AgentPromptComponent,
        PromptOverviewComponent
    ],
    imports: [
        CommonModule,
        AgentPromptRoutingModule,
        AgentSharedModule
    ]
})
export class AgentPromptModule { }
