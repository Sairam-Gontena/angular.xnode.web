import { Injectable } from '@angular/core';
import { FormComponent } from './form-component';
import { FormControl, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class BuilderService {
  constructor() {}

  getFormGroup(comps: FormComponent[]) {
    let formGroup: any = {};

    comps.forEach((comp) => {
      let control = new FormControl(comp.value || '');
      if (comp.required) {
        control.addValidators(Validators.required);
      }

      formGroup[comp.key] = control;
    });
    return new formGroup(formGroup);
  }
}
