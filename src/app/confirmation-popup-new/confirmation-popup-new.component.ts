import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xnode-confirmation-popup-new',
  templateUrl: './confirmation-popup-new.component.html',
  styleUrls: ['./confirmation-popup-new.component.scss']
})
export class ConfirmationPopupNewComponent {
  @Input() header: any;
  @Input() content: any;
  @Output() onClickAction = new EventEmitter<any>();
  @Input() visible: boolean = false;
}
