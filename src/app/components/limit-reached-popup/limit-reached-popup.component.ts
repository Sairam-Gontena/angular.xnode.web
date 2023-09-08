import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xnode-limit-reached-popup',
  templateUrl: './limit-reached-popup.component.html',
  styleUrls: ['./limit-reached-popup.component.scss']
})
export class LimitReachedPopupComponent {
  @Input() visible: any;
  @Output() closePopup = new EventEmitter<boolean>();

}
