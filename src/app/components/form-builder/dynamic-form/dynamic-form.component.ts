import { Component, Input, OnInit } from '@angular/core';
import { BuilderService } from '../builder.service';
import { FormComponent } from '../form-component';
import { FormGroup } from '@angular/forms';
import { JsonFormBuilderService } from '../json-form-builder.service';

@Component({
  selector: 'xnode-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  // @Input() inputControls: FormComponent[] = [];
  @Input() formGroup: FormGroup|any = undefined;
  @Input() parenFormGroup: FormGroup|any = undefined;

  @Input() noSQLForm:any;

  constructor(private service: BuilderService) {
    // this.inputControls = [
    //   {
    //     key: 'firstName',
    //     label: 'First name',
    //     value: 'Bombasto',
    //     required: true,
    //     order: 1,
    //     type: 'string',
    //     controlType: 'textbox',
    //   },
    //   {
    //     key: 'lastName',
    //     label: 'Last name',
    //     value: '',
    //     required: true,
    //     order: 2,
    //     type: 'string',
    //     controlType: 'textbox',
    //   },
    //   {
    //     key: 'email',
    //     label: 'Email',
    //     value: '',
    //     required: true,
    //     order: 3,
    //     type: 'string',
    //     controlType: 'email',
    //   },
    // ];
  }

  ngOnInit() {
    // this.formGroup = this.service.getFormGroup(this.inputControls);
  }

  getFormGroup(){
    this.formGroup = this.service.getFormGroup(this.noSQLForm.controls, this.parenFormGroup)
    return this.formGroup;
  }
}
