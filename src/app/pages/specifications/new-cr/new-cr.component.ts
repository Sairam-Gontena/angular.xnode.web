import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xnode-new-cr',
  templateUrl: './new-cr.component.html',
  styleUrls: ['./new-cr.component.scss']
})
export class NewCrComponent {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Output() closePopUp = new EventEmitter<boolean>();
  newCr: string = '';

  popUpClose() {
    this.visible = false
    this.closePopUp.emit(false);
  }

}
