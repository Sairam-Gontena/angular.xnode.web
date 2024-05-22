import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentSharedModule } from '../../agent-shared.module';
import { AgentPromptComponent } from './agent-prompt.component';
import { AgentPromptRoutingModule } from './agent-prompt-routing.module';
import { PromptOverviewComponent } from './component/prompt-overview/prompt-overview.component';
import { TextareaAutoresizeDirective } from 'src/app/directive/textarea-autoresize.directive';
import { ComparePromptComponent } from './component/compare-prompt/compare-prompt.component';


@NgModule({
    declarations: [
        AgentPromptComponent,
        PromptOverviewComponent,
        TextareaAutoresizeDirective,
        ComparePromptComponent
    ],
    imports: [
        CommonModule,
        AgentPromptRoutingModule,
        AgentSharedModule
    ],
    exports: [
        PromptOverviewComponent
    ]
})
export class AgentPromptModule { }
