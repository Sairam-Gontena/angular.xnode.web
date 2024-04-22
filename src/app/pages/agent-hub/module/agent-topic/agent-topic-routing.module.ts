import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentTopicComponent } from './agent-topic.component';

const routes: Routes = [{ path: '', component: AgentTopicComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentTopicRoutingModule { }
