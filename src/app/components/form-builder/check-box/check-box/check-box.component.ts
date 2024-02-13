import { Component, Input } from '@angular/core';
import { FormComponent } from '../../form-component';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
  options:any;

  ngOnChanges(){
    this.options = this.control.options;
  }
  
}
