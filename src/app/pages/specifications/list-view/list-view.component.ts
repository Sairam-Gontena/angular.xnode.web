import { Component, Input } from '@angular/core';
import { Section } from 'src/models/section';

@Component({
  selector: 'xnode-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  @Input() content!: Array<Section>;
  @Input() searchTerm!: string;
  @Input() selectedContent!: string;
  @Input() users: any = [];
  @Input() specItem: any;
  showCommentIcon: boolean = false;
  selectedIndex?: number;
  commentOverlayPanelOpened: boolean = false;

  onTextSelected(event: MouseEvent) {
    const selectedText = this.getSelectedText();
  }

  private getSelectedText() {
    const text = window.getSelection()?.toString();
    return text ? text.trim() : null;
  }
}


