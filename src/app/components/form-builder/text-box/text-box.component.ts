import { Component, Input } from '@angular/core';
import { FormComponent } from '../form-component';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss'],
})
export class TextBoxComponent {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
  // @Input() fControl: AbstractControl | undefined;

}
