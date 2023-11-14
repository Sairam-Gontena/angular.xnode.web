import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xnode-conversation-actions',
  templateUrl: './conversation-actions.component.html',
  styleUrls: ['./conversation-actions.component.scss']
})
export class ConversationActionsComponent {
  @Input() cmt:any;
  @Output() updateAction = new EventEmitter<{action: string, cmt: any}>();

  onClickReply(cmt: any): void {
    this.updateAction.emit({
      action: 'REPLY',
      cmt: cmt
    })
  }

  editComment(cmt: any): void {
    this.updateAction.emit({
      action: 'EDIT',
      cmt: cmt
    })
  }

  linkToCr(cmt: any): void {
    this.updateAction.emit({
      action: 'LINKTOCR',
      cmt: cmt
    })
  }

  deleteCurrentComment(cmt: any): void {
    this.updateAction.emit({
      action: 'DELETE',
      cmt: cmt
    })
  }
}
