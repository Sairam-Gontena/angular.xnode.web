import { Component, Input } from '@angular/core';
import { FormComponent } from '../form-component';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'xnode-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss'],
})
export class TextBoxComponent {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
  @Input() submitted:any;
  @Input() fControl: AbstractControl | undefined;

  constructor(
    private formBuilder: FormBuilder,
    // private router: Router,
    // private authApiService: AuthApiService,
    // private utilsService: UtilsService
  ) {
  }

}
