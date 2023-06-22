import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-operate-feedback',
  templateUrl: './operate-feedback.component.html',
  styleUrls: ['./operate-feedback.component.scss']
})
export class OperateFeedbackComponent {
  @Output() getOperateLayout: EventEmitter<string> = new EventEmitter<string>();

  selectedContainer: string = 'Feed-Overview';
  iframeUrl: string = "http://localhost:62630/";

  constructor(private router: Router) {
  }

  drag(ev: any) {
    ev.dataTransfer?.setData('text/plain', ev.target.id);
    window.frames[0].postMessage({
      type: 'dragItem', itemId: ev.target.id
    }, this.iframeUrl);
  }

  onSelectLayout(layout: string): void {
    this.selectedContainer = layout;
    if (this.selectedContainer === layout) {
      this.selectedContainer = '';
    } else {
      this.selectedContainer = layout;
    }
    this.getOperateLayout.emit(layout);
    
  }

  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drop(ev: any) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
}
