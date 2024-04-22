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
    loadChildren: () => import('./module/agent-details/agent-details.module').then((m) => m.AgentDetailsModule),
  },
  {
    path: 'topic/:id',
    loadChildren: () => import('./module/agent-topic/agent-topic.module').then(m => m.AgentTopicModule)
  },
  {
    path: 'agent-hub-detail',
    component: AgentHubComponent, loadChildren: () => import('./module/agent-hub-detail/agent-hub-detail.module').then(m => m.AgentHubDetailModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentHubRoutingModule { }
