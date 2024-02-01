import { Component, Input } from '@angular/core';
import { FormComponent } from '../../form-component';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
  date: Date[] | undefined;
}
