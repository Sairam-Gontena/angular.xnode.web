import { Component, Input } from '@angular/core';
import { FormComponent } from '../../form-component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-dynamic-button',
  templateUrl: './dynamic-button.component.html',
  styleUrls: ['./dynamic-button.component.scss']
})
export class DynamicButtonComponent {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
}


