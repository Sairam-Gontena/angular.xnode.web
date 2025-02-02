import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentPromptComponent } from './agent-prompt.component';

const routes: Routes = [{ path: '', component: AgentPromptComponent, data: { breadcrumb: 'Prompt' } }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgentPromptRoutingModule { }
