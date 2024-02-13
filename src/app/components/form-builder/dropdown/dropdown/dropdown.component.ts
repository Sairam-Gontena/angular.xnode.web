import { Component, Input } from '@angular/core';
import { FormComponent } from '../../form-component';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;

}
