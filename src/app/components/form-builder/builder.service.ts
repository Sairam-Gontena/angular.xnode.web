import { Injectable } from '@angular/core';
import { FormComponent } from './form-component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class BuilderService {
  constructor() {}

  getFormGroup(comps: FormComponent[]): FormGroup {
    let formGroup: any = {};

    comps.forEach((comp) => {
      let control = new FormControl(comp.value || '');
      if (comp.required) {
        control.addValidators(Validators.required);
      }

      formGroup[comp.key] = control;
    });
    return new FormGroup(formGroup);
  }
}
