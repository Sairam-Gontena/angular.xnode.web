import { Component } from '@angular/core';

@Component({
  selector: 'xnode-ui-elements',
  templateUrl: './ui-elements.component.html',
  styleUrls: ['./ui-elements.component.scss']
})
export class UiElementsComponent {

  iframeUrl: string = "http://localhost:50360/";

  drag(ev: any) {
    console.log(ev)
    ev.dataTransfer?.setData('text/plain', ev.target.id);
    window.frames[0].postMessage({
      type: 'dragItem', itemId: ev.target.id
    }, this.iframeUrl);
  }
}
