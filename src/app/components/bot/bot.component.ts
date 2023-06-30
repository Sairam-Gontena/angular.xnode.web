import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xnode-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {

  @Output() chatBotFlag = new EventEmitter<boolean>();
  @Input() botDisplayFlag: boolean = true;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onClickContinue(): void {
    this.chatBotFlag.emit(true);
    // this.router.navigate(['/x-pilot']);
  }

}
