import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentHubComponent } from './agent-hub.component';

const routes: Routes = [
  {
    path: '',
    component: AgentHubComponent
  },
  {
    path: 'agent/:id',
    loadChildren: () => import('./module/agent-details/agent-details.module').then((m) => m.AgentDetailsModule),
  },
  {
    path: 'topic/:id',
    loadChildren: () => import('./module/agent-topic/agent-topic.module').then(m => m.AgentTopicModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentHubRoutingModule { }
