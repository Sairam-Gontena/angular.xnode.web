import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackListComponent } from './feedback-list.component';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedbackListRoutingModule } from './feedback-list-routing.module';
import { FeedbackConversationComponent } from './feedback-conversation/feedback-conversation.component';


@NgModule({
  declarations: [
    FeedbackListComponent,
    FeedbackConversationComponent
  ],
  imports: [
    CommonModule,
    FeedbackListRoutingModule,
    SharedComponentModule,
    SharedModule
  ]
})
export class FeedbackListModule { }
