import { Component, Input, OnInit } from '@angular/core';
import { BuilderService } from '../builder.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {

  @Input() form:any = this.fb.group({});
  @Input() parenFormGroup: FormGroup|any = undefined;
  @Input() noSQLForm:any;

  formList: FormArray;

  constructor(private service: BuilderService, private fb:FormBuilder) {
    this.formList = this.fb.array([])
  }

  ngOnInit() {
    const formGroup = this.service.getFormGroup(this.noSQLForm.controls)
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

  print(f:any){
    console.log('form final:',f)
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
    // console.log('this.children.at(i):',i,this.children.at(i))
      return this.formList.at(i) as FormGroup;
  }

  get children() {
    return this.form.controls["children"] as FormArray;
  }

  getFormControl(){

  }

  // getFormGroup(){
  //   this.formGroup = this.service.getFormGroup(this.noSQLForm.controls,this.noSQLForm.isArray, this.parenFormGroup)
  //   return this.formGroup;
  // }
}
