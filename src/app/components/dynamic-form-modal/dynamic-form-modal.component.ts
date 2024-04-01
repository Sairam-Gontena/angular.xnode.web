import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-dynamic-form-modal',
  templateUrl: './dynamic-form-modal.component.html',
  styleUrls: ['./dynamic-form-modal.component.scss']
})
export class DynamicFormModalComponent {
  @Input() heading!: string;
  @Input() subHeading!: string;
  @Input() display: boolean = false;
  @Input() promptData!: any;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public promptForm!: FormGroup;
  
  constructor(private formBuilder: FormBuilder) {
    this.promptForm = this.formBuilder.group({
      name: [""],
      description: [""],
      instructions: [""],
      conversationStarters: [""],
      linkParent: [""]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['promptData']?.currentValue) {
      this.promptData = changes['promptData']?.currentValue;
      this.promptForm.patchValue({
        name: this.promptData.name,
        description: this.promptData.description,
        instructions: this.promptData.instruction,
        conversationStarters: "",
        linkParent: this.promptData.parent
      })
    }
  }

  onClose() {
    this.displayChange.emit(false);
  }

  onSubmit() {
    console.log(this.promptForm.value);
    this.onClose();
  }
}
