import { Injectable } from '@angular/core';
import { FormComponent, JSONForm } from './form-component';


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

    if (!Array.isArray(doc) && this.isPrimitive(doc)) {
      formJson.controls.push(this.constructControl(formName, doc, 0));
    } else if (Array.isArray(doc)) { // array can be of objects/primitives

          if (!this.isPrimitive(doc[0])) { // object array
            const subForm = this.constructJSONForm(formName, doc[0]);
            subForm.isArray = true;
            formJson.subForms.push(subForm);
          } else { // primitive array
            formJson.controls.push(this.constructControl(formName, doc[0], 0, true));
          }
    } else {
      const keys = Object.keys(doc);
      let orderCnt = 0;
      for (const key of keys) {
        const val = doc[key];
        // console.log('val:', typeof val, Array.isArray(val), val);
        if (Array.isArray(val)) { // array can be of objects/primitives

              if (!this.isPrimitive(val[0])) { // object array
                const subForm = this.constructJSONForm(key, val[0]);
                subForm.isArray = true;
                formJson.subForms.push(subForm);
              } else { // primitive array
                formJson.controls.push(this.constructControl(key, val[0], 0, true));
              }

        } else if (!this.isPrimitive(val)) {
          formJson.subForms.push(this.constructJSONForm(key, val));
        } else {
          formJson.controls.push(this.constructControl(key, val, orderCnt++));
        }
      }
    }

    return formJson;
  }
  constructControl(key: string, val: any, orderCnt: number, isArray = false): FormComponent {
    let comp = new FormComponent();
    comp.key = key;
    comp.label = key;
    comp.value = '';
    comp.required = true;
    comp.order = orderCnt;
    comp.isArray = false;
    comp.type = isArray ? 'string[] ' :this.dataType(val);
    comp.controlType = isArray ? 'chips' : this.controlType(val);
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

  isPrimitive(val:any):boolean {
    return val !== Object(val);
}
}
