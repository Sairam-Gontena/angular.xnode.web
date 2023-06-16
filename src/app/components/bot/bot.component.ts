import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onClickContinue(): void {
    this.router.navigate(['/chat-bot']);
  }

}
