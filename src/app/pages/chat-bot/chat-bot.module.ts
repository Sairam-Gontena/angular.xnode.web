import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBotRoutingModule } from './chat-bot-routing.module';
import { ChatBotComponent } from './chat-bot.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    ChatBotComponent
  ],
  imports: [
    CommonModule,
    ChatBotRoutingModule,
    ButtonModule,
    DropdownModule
  ]
})
export class ChatBotModule { }
