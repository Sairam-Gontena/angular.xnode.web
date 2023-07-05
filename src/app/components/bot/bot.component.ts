import { Component, OnInit, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'xnode-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})

export class BotComponent implements OnInit {

  constructor(private elementRef: ElementRef,private router: Router) {
  }
  // @Output() chatBotFlag = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<any>();
  @Input() botDisplayFlag: boolean = true;
  
  private isDragging: boolean = false;
  private initialX: number = 0;
  private initialY: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private botContainer: HTMLElement | null = null;


  onClickContinue(): void {
    let productContext = localStorage.getItem('record_id');
    this.valueChange.emit({'productContext': productContext, 'cbFlag':true});
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
