import { Component, Input } from '@angular/core';
import { FormComponent } from '../../form-component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'xnode-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
  options:any;
  value!: string;
  

  ngOnChanges(){
    this.options = this.control.options;
  }
}
