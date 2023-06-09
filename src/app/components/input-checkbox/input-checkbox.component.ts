import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xnode-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss']
})
export class InputCheckboxComponent {
  @Input() checkBox: FormGroup;

  constructor() {
    this.checkBox = new FormGroup('', Validators.required);
    
  }
}
