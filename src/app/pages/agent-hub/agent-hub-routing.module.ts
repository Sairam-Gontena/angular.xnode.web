import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentHubComponent } from './agent-hub.component';

const routes: Routes = [{
  path: '', data: { breadcrumb: null },
  component: AgentHubComponent, loadChildren: () => import('./module/agent-hub-detail/agent-hub-detail.module').then(m => m.AgentHubDetailModule)
}, {
  path: 'agent/:id', data: { breadcrumb: null }, component: AgentHubComponent,
  loadChildren: () => import('./module/agent-details/agent-details.module').then((m) => m.AgentDetailsModule),
}, {
  path: 'capability/:id', data: { breadcrumb: null }, component: AgentHubComponent,
  loadChildren: () => import('./module/agent-capability/agent-capability.module').then((m) => m.AgentCapabilityModule),
}, {
  path: 'topic', data: { breadcrumb: null }, component: AgentHubComponent,
  loadChildren: () => import('./module/agent-topic/agent-topic.module').then(m => m.AgentTopicModule)
}, {
  path: 'prompt/:id', data: { breadcrumb: null }, component: AgentHubComponent,
  loadChildren: () => import('./module/agent-prompt/agent-prompt.module').then(m => m.AgentPromptModule)
}, {
  path: 'tool/:id', data: { breadcrumb: null }, component: AgentHubComponent,
  loadChildren: () => import('./module/agent-tools/agent-tools.module').then(m => m.AgentToolsModule)
}, {
  path: 'model', data: { breadcrumb: null }, component: AgentHubComponent,
  loadChildren: () => import('./module/agent-model/agent-model.module').then(m => m.AgentModelModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentHubRoutingModule { }
