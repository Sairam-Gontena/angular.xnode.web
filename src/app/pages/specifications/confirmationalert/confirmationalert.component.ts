import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xnode-confirmationalert',
  templateUrl: './confirmationalert.component.html',
  styleUrls: ['./confirmationalert.component.scss']
})
export class ConfirmationalertComponent {
  @Output() confirmationPrompt = new EventEmitter<boolean>();
  @Input() visible: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  closePrompt() {
    this.visible = false
    this.confirmationPrompt.emit(false);
  }
  confirmPrompt() {
    this.visible = false
    this.confirmationPrompt.emit(false);
    // call service call to delete comment
  }

}
