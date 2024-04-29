import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDetailsComponent } from './agent-details.component';

const routes: Routes = [{ path: ':id', component: AgentDetailsComponent, data: { breadcrumb: 'Agents' } },
{
  path: '', data: { breadcrumb: 'Agents' },
  children: [{ path: 'topic', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-topic/agent-topic.module').then(m => m.AgentTopicModule) },
  { path: 'model', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-model/agent-model.module').then(m => m.AgentModelModule) }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentDetailsRoutingModule { }