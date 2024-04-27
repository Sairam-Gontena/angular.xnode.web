import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentCapabilityComponent } from './agent-capability.component';

const routes: Routes = [{ path: '', component: AgentCapabilityComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgentCapabilityRoutingModule { }
