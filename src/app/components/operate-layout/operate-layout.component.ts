import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-operate-layout',
  templateUrl: './operate-layout.component.html',
  styleUrls: ['./operate-layout.component.scss']
})
export class OperateLayoutComponent {
  @Output() getconfigureLayout: EventEmitter<string> = new EventEmitter<string>();

  selectedContainer: string = 'CONTAINER';
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
    this.getconfigureLayout.emit(layout);
    // console.log(this.selectedContainer)
    // if (layout === 'Overview') {
    //   this.selectedContainer == 'Overview';
    // console.log(this.selectedContainer)

    // } else {
    //   this.selectedContainer == 'Alerts';
    // console.log(this.selectedContainer)

    // }
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
