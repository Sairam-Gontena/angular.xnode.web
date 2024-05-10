import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentDetailsComponent } from './agent-details.component';

const routes: Routes = [
  // { path: ':id', component: AgentDetailsComponent, data: { breadcrumb: 'Agents' } },

  { path: '', component: AgentDetailsComponent, data: { breadcrumb: 'Agents' } },
  {
    path: '', data: { breadcrumb: 'Agents' },
    children: [
      { path: 'capability/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-capability/agent-capability.module').then((m) => m.AgentCapabilityModule) },
      { path: 'topic/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-topic/agent-topic.module').then(m => m.AgentTopicModule) },
      { path: 'prompt/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-prompt/agent-prompt.module').then(m => m.AgentPromptModule) },
      { path: 'tool/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-tools/agent-tools.module').then(m => m.AgentToolsModule) },
      { path: 'model/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-model/agent-model.module').then(m => m.AgentModelModule) }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentDetailsRoutingModule { }