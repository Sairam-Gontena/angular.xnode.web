import { Component, Input } from '@angular/core';
import { FormComponent } from '../form-component';

@Component({
  selector: 'xnode-dynamic-control',
  templateUrl: './dynamic-control.component.html',
  styleUrls: ['./dynamic-control.component.scss'],
})
export class DynamicControlComponent {
  @Input() control!: FormComponent;

  // isValid() {
  //   return this.formGroup.controls[this.control.key].valid;
  // }
}
