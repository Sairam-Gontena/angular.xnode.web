import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBotRoutingModule } from './chat-bot-routing.module';
import { ChatBotComponent } from './chat-bot.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ChatBotComponent
  ],
  imports: [
    CommonModule,
    ChatBotRoutingModule,
    SharedModule
  ]
})
export class ChatBotModule { }
