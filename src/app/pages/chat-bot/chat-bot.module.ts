import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatBotRoutingModule } from './chat-bot-routing.module';
import { ChatBotComponent } from './chat-bot.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';


@NgModule({
  declarations: [
    ChatBotComponent
  ],
  imports: [
    CommonModule,
    PrimeModulesModule,
    ChatBotRoutingModule
  ]
})
export class ChatBotModule { }
