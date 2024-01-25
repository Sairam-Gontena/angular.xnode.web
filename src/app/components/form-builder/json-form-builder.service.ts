import { Injectable } from '@angular/core';
import { FormComponent, JSONForm } from './form-component';
import { JSON_DOC } from './json';

@Injectable({
  providedIn: 'root',
})
export class JsonFormBuilderService {
  constructor() {
    // const formObj = this.constructJSONForm('', JSON_DOC);
    // console.log('formObj:', formObj);
  }

  constructJSONForm(formName: string, doc: any) {
    const formJson = new JSONForm(formName, [], []);
    if (!doc) {
      return formJson;
    }

    if (!Array.isArray(doc) && typeof doc !== 'object') {
      formJson.controls.push(this.constructControl(formName, doc, 0));
    } else if (Array.isArray(doc)) {
      const subForm = this.constructJSONForm(formName, doc[0]);
      subForm.isArray = true;
      formJson.subForms.push(subForm);
    } else {
      const keys = Object.keys(doc);
      let orderCnt = 0;
      for (const key of keys) {
        console.log('key', key);
        const val = doc[key];
        console.log('val:', typeof val, Array.isArray(val), val);
        if (Array.isArray(val)) {
          console.log('val[0]', val[0]);
          const subForm = this.constructJSONForm(key, val[0]);
          subForm.isArray = true;
          formJson.subForms.push(subForm);
        } else if (typeof val === 'object') {
          formJson.subForms.push(this.constructJSONForm(key, val));
        } else {
          formJson.controls.push(this.constructControl(key, val, orderCnt++));
        }
      }
    }

    return formJson;
  }
  constructControl(key: string, val: any, orderCnt: number): FormComponent {
    let comp = new FormComponent();
    comp.key = key;
    comp.label = key;
    comp.value = '';
    comp.required = true;
    comp.order = orderCnt;
    (comp.type = this.dataType(val)),
      (comp.controlType = this.controlType(val));
    return comp;
  }

  dataType(element: any): string {
    switch (element.type) {
      case 'integer':
        return 'number';
      case 'float':
        return 'number';
    }
    return 'string';
  }

  controlType(element: any): string {
    switch (element.type) {
      case 'integer':
        return 'number';
      case 'float':
        return 'number';
    }
    return 'textbox';
  }
}
