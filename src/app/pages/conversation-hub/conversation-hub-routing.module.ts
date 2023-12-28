import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversationHubComponent } from './conversation-hub/conversation-hub.component';

const routes: Routes = [
  {
    path: '',
    component: ConversationHubComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversationHubRoutingModule { }
