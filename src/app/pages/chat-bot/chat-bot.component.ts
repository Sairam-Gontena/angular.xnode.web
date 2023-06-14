import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent {

  constructor(private router: Router) {
  }
  onClickContinue(): void {
    this.router.navigate(['/my-templates']);
  }
}
