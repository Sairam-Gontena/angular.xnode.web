import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {
  displayoff: boolean = false;
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onClickContinue(): void {
    this.displayoff ? this.displayoff = false : this.displayoff = true;
    // this.router.navigate(['/chat-bot']);
  }

  displayoffFunc() {
    this.displayoff ? this.displayoff = false : this.displayoff = true;
  }

}
