import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'xnode-layout-elements',
  templateUrl: './layout-elements.component.html',
  styleUrls: ['./layout-elements.component.scss']
})
export class LayoutElementsComponent {
  @Output() getLayout: EventEmitter<string> = new EventEmitter<string>();
  selectedContainer: string = 'CONTAINER';

  onSelectLayout(layout: string): void {
    this.selectedContainer = layout
    this.getLayout.emit(layout);
  }

}
