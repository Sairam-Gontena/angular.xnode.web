import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentHubDetailComponent } from './agent-hub-detail.component';

const routes: Routes = [{ path: '', data: { breadcrumb: null }, component: AgentHubDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentHubDetailRoutingModule { }
