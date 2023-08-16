import { Component, Input } from '@angular/core';
import { FormComponent } from '../form-component';

@Component({
  selector: 'xnode-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.scss'],
})
export class EmailInputComponent {
  @Input() control!: FormComponent;
}
