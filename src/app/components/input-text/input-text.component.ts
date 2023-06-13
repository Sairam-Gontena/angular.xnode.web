import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xnode-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent {
  // @Input() childForm: FormGroup | undefined;
  @Input() address: FormGroup;
  submitted:boolean = false;
  constructor() {
    this.address = new FormGroup('', Validators.required);
    
  }
  
}
