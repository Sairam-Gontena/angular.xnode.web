import { AfterContentChecked, AfterContentInit,  Component, Input, OnInit } from '@angular/core';
import { BuilderService } from '../builder.service';
import {  FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit, AfterContentChecked {

  @Input() form:FormGroup = this.fb.group({});
  @Input() noSQLForm:any;
  date3: Date | undefined;
  @Input() inputDoc:any = {}

  constructor(private service: BuilderService, private fb:FormBuilder) {
  }

  ngOnInit() {
    const formGroup = this.service.getFormGroup(this.noSQLForm.controls)
    this.form = formGroup;
  }

  ngAfterContentChecked(): void {
    this.form.patchValue(this.inputDoc)
  }

  getInputDoc(formName:string) {
    this.inputDoc[formName]
  }

  onSubmit(formSubmitted:FormGroup) {
    console.log(formSubmitted.getRawValue())
   console.log(this.form)
  }

}