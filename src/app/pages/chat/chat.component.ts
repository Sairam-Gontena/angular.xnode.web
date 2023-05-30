import { Component } from '@angular/core';
import  botChat from 'src/assets/json/bot.json';

@Component({
  selector: 'xnode-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  botData: any;

  constructor () {
    this.botData = botChat.botChat;
  }
}
