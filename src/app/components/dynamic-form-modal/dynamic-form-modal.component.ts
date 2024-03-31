import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xnode-dynamic-form-modal',
  templateUrl: './dynamic-form-modal.component.html',
  styleUrls: ['./dynamic-form-modal.component.scss']
})
export class DynamicFormModalComponent {
  @Input() heading!: string;
  @Input() subHeading!: string;
  
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
    console.log(formData);
    this.onClose();
  }
}
