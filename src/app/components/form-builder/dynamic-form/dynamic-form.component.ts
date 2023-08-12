import { Component, Input, OnInit } from '@angular/core';
import { BuilderService } from '../builder.service';
import { FormComponent } from '../form-component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  @Input() inputControls: FormComponent[] = [];
  formGroup!: FormGroup;

  constructor(private service: BuilderService) {}

  ngOnInit() {
    this.formGroup = this.service.getFormGroup(this.inputControls);
  }
}
