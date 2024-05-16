import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentToolsComponent } from './agent-tools.component';

const routes: Routes = [{ path: '', component: AgentToolsComponent, data: { breadcrumb: 'Tools' } }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgentToolsRoutingModule { }
