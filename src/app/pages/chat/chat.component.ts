import { Component } from '@angular/core';
import  botChat from 'src/assets/json/bot.json';
import  userChat from 'src/assets/json/user.json';


@Component({
  selector: 'xnode-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  botData: any;
  userData: any;

  constructor () {
    console.log(userChat.userChat[0]);
    this.botData = botChat.botChat;
    this.userData = userChat.userChat;
  }
}
