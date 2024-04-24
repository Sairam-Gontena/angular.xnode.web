import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentHubComponent } from './agent-hub.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'agent-hub-detail',
    pathMatch: 'full',
  },
  {
    path: 'agent/:id',
    component: AgentHubComponent, loadChildren: () => import('./module/agent-details/agent-details.module').then((m) => m.AgentDetailsModule),
  },
  {
    path: 'topic/:id',
    component: AgentHubComponent, loadChildren: () => import('./module/agent-topic/agent-topic.module').then(m => m.AgentTopicModule)
  },
  {
    path: 'agent-hub-detail',
    component: AgentHubComponent, loadChildren: () => import('./module/agent-hub-detail/agent-hub-detail.module').then(m => m.AgentHubDetailModule)
  },
  {
    path: 'model/:id',
    component: AgentHubComponent, loadChildren: () => import('./module/agent-model/agent-model.module').then(m => m.AgentModelModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentHubRoutingModule { }
