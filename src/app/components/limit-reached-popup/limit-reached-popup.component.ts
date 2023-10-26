import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'xnode-limit-reached-popup',
  templateUrl: './limit-reached-popup.component.html',
  styleUrls: ['./limit-reached-popup.component.scss']
})
export class LimitReachedPopupComponent {
  @Input() visible: any;
  @Input() limitReachedContent: boolean = false;
  @Output() closePopup = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event'])
  public closeDialogOnClick(event: any): void {
    if (this.visible) {
      if (!event.target.closest('p-dialog')) {
        this.closePopup.emit(true);
      }
    }
  }
}
