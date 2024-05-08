import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentModelComponent } from './agent-model.component';

const routes: Routes = [{ path: '', data: { breadcrumb: null }, component: AgentModelComponent },
{ path: ':id', data: { breadcrumb: 'Model' }, component: AgentModelComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentModelRoutingModule { }
