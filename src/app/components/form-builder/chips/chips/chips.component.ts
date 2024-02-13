import { Component, Input } from '@angular/core';
import { FormComponent } from '../../form-component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'xnode-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      values: [null, [Validators.required, this.chipsValidator]]
    });
  }

  chipsValidator(control:any) {
    const values = control.value;
    return values && values.length > 0 ? null : { 'chipsError': true };
  }
}
