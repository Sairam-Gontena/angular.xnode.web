import { Component, Input } from '@angular/core';
import { FormComponent } from '../../form-component';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent {

  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
  options:any;

  ngOnChanges(){
    this.options = this.control.options;
  }

}