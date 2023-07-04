import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';

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
    this.chatBotFlag.emit(true);
    // this.router.navigate(['/x-pilot']);
  }
  ngOnInit(): void {
    this.botContainer = this.elementRef.nativeElement.querySelector('#botContainer');
  }
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.initialX = event.clientX - this.offsetX;
    this.initialY = event.clientY - this.offsetY;
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.botContainer) {
      this.offsetX = event.clientX - this.initialX;
      this.offsetY = event.clientY - this.initialY;
      this.botContainer.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
    }
  }
  onMouseUp(): void {
    this.isDragging = false;

    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}
