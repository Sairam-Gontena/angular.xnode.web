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
  @Input() noSQLForm:any;

  constructor(private service: BuilderService, private fb:FormBuilder) {
  }

  ngOnInit() {
    const formGroup = this.service.getFormGroup(this.noSQLForm.controls)
    this.form = formGroup;
  }


  onSubmit(formSubmitted:FormGroup) {
    console.log(formSubmitted.value)
  }

}
