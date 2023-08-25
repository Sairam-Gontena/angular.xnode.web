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

  entityToDynamicForm(obj:any):FormComponent[] {
    let props = obj.properties;
    let controls:FormComponent[] = []
    let orderCnt =1;
    for (let key of Object.keys(props) ) {
      const element = props[key];
      controls.push(
        {
          key: key,
          label: key,
          value: '',
          required: true,
          order: orderCnt++,
          type: this.dataType(element),
          controlType: this.controlType(element),
        })
    }
    return controls;
  }

  dataType(element:any):string{
    switch (element.type) {
      case 'integer': return 'number';
      case 'float': return 'number';
    }
    return 'string';
  }

  controlType(element:any):string{
    switch (element.type) {
      case 'integer': return 'number';
      case 'float': return 'number';
    }
    return 'textbox';
  }
}
