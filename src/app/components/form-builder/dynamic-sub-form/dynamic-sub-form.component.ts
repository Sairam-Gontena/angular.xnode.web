import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BuilderService } from '../builder.service';
@Component({
  selector: 'xnode-dynamic-sub-form',
  templateUrl: './dynamic-sub-form.component.html',
  styleUrls: ['./dynamic-sub-form.component.scss'],
})
export class DynamicSubFormComponent implements OnInit{
  @Input() parenFormGroup!: FormGroup;
  @Input() noSQLForm:any;
  formList: FormArray;

  constructor(private service: BuilderService, private fb:FormBuilder) {
    this.formList = this.fb.array([])
  }

  ngOnInit(): void {
    if(this.noSQLForm.isArray) {
      this.formList = this.fb.array([])
      this.formList.push(formGroup)
      this.form[this.noSQLForm.formName] = this.formList;
    } else {
        this.form = formGroup;
    }
    if(this.parenFormGroup){
        this.parenFormGroup[this.noSQLForm.formName]=this.form;
    }
  }
}
