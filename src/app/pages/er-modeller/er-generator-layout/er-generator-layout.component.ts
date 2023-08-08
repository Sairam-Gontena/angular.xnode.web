import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'xnode-er-generator-layout',
  templateUrl: './er-generator-layout.component.html',
  styleUrls: ['./er-generator-layout.component.scss']
})
export class ErGeneratorLayoutComponent {
  @Output() getconfigureLayout: EventEmitter<string> = new EventEmitter<string>();
  selectedContainer?: string = "DATA_MODEL";
  iframeUrl: string = "http://localhost:62630/";
  @Input() type: any;

  constructor(private router: Router) {
  }

  onSelectLayout(layout: string): void {
    this.selectedContainer = layout;
    if (layout === 'DATA_MODEL') {
      this.router.navigate(['/configuration/data-model/overview']);
    } else {
      this.router.navigate(['/configuration/api-integration']);
    }
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

  onClickApiIntegration(): void {
    this.router.navigate(['/configuration/api-integration']);
  }
}
