import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'xnode-configure-layout',
  templateUrl: './configure-layout.component.html',
  styleUrls: ['./configure-layout.component.scss']
})
export class ConfigureLayoutComponent {
  @Output() getconfigureLayout: EventEmitter<string> = new EventEmitter<string>();

  selectedContainer: string = 'CONTAINER';
  iframeUrl: string = "http://localhost:62630/";

  onSelectLayout(layout: string): void {
    this.selectedContainer = layout
    this.getconfigureLayout.emit(layout);
  }

  drag(ev: any) {
    ev.dataTransfer?.setData('text/plain', ev.target.id);
    window.frames[0].postMessage({
      type: 'dragItem', itemId: ev.target.id






    }, this.iframeUrl);
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
