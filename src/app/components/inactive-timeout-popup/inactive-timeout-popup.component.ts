import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'xnode-inactive-timeout-popup',
  templateUrl: './inactive-timeout-popup.component.html',
  styleUrls: ['./inactive-timeout-popup.component.scss']
})
export class InActiveTimeoutPopupComponent {
  @Input() visible: any;
  @Input() countdown?: number;
  @Output() closePopup = new EventEmitter<boolean>();
  @Output() logout = new EventEmitter<boolean>();

  // @HostListener('document:click', ['$event'])
  // public closeDialogOnClick(event: any): void {
  //   if (this.visible) {
  //     if (!event.target.closest('p-dialog')) {
  //       this.closePopup.emit(true);
  //     }
  //   }
  // }
}
