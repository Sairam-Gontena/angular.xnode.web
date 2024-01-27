import { Component, Input } from '@angular/core';
import { FormComponent } from '../form-component';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'xnode-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})

export class NumberInputComponent {
  @Input() control!: FormComponent;
  @Input() fControl: AbstractControl | undefined;

}
