import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xnode-create-account-popup',
  templateUrl: './create-account-popup.component.html',
  styleUrls: ['./create-account-popup.component.scss']
})
export class CreateAccountPopupComponent {
  @Input() visible: boolean = false;
  @Output() showPopup = new EventEmitter<boolean>();
  Popup() {
    this.showPopup.emit(!this.visible);
  }

}
