import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  onClickContinue(): void {
    this.router.navigate(['/design']);
  }

}
