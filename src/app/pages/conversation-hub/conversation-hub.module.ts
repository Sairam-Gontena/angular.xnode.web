import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationHubComponent } from './conversation-hub/conversation-hub.component';
import { ConversationHubRoutingModule } from './conversation-hub-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ConversationHubComponent
  ],
  imports: [
    ConversationHubRoutingModule,
    CommonModule,
    SharedModule,
  ]
})
export class ConversationHubModule { }
