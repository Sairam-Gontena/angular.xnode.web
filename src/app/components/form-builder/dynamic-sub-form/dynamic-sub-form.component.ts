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
  form :any = this.fb.group({});

  constructor(private service: BuilderService, private fb:FormBuilder) {
    this.formList = this.fb.array([])
  }

  ngOnInit(): void {
    const formGroup = this.service.getFormGroup(this.noSQLForm.controls)
    if(this.noSQLForm.isArray) {
      this.formList.push(formGroup)
      this.form[this.noSQLForm.formName] = this.formList;
    } else{
      this.form = formGroup;
    }

    if(this.parenFormGroup){
        this.parenFormGroup.controls[this.noSQLForm.formName]=this.form;
    }
  }

  add() {
    const formGroup = this.service.getFormGroup(this.noSQLForm.controls)
    if(this.noSQLForm.isArray) {
      this.formList.push(formGroup)
    }
  }

  remove(i:number) {
    if(this.noSQLForm.isArray) {
      this.formList.removeAt(i)
    }
  }

  getFormC(i:number) {
      return this.formList.at(i) as FormGroup;
  }
}
