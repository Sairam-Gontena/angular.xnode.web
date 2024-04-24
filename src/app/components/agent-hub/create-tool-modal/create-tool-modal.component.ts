import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xnode-create-tool-modal',
  templateUrl: './create-tool-modal.component.html',
  styleUrls: ['./create-tool-modal.component.scss']
})
export class CreateToolModalComponent {
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  onClose() {
    this.displayChange.emit(false);
  }

  // Initialize form group
  createToolForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // Initialize form with form builder
    this.createToolForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      select_scheme: ['import', Validators.required],
      tool_url: [''],
      schema: ['']
    });
  }

  // Method to submit form
  submitForm() {
    if (this.createToolForm.valid) {
      console.log('Form submitted successfully!', this.createToolForm.value);
    }
  }

}
