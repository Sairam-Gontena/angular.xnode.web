import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xnode-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  name: string = '';
  instructions: string = '';
  conversationStarters: string = '';
  linkParent: string = '';
  description: string = '';

  onClose() {
    this.displayChange.emit(false);
  }

  onSubmit() {
    const formData = {
      name: this.name,
      instructions: this.instructions,
      conversationStarters: this.conversationStarters,
      linkParent: this.linkParent,
      description: this.description
    };
    console.info(formData);
    this.onClose();
  }
}
