import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'xnode-layout-elements',
  templateUrl: './layout-elements.component.html',
  styleUrls: ['./layout-elements.component.scss']
})
export class LayoutElementsComponent {
  @Output() getLayout: EventEmitter<string> = new EventEmitter<string>();

  selectedContainer: string = 'CONTAINER';
  iframeUrl: string = "http://localhost:60939/";

  onSelectLayout(layout: string): void {
    this.selectedContainer = layout
    this.getLayout.emit(layout);
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
