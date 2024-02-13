import {  Component, Input, OnInit, Optional, Self } from '@angular/core';
import { FormComponent } from '../form-component';
import {  FormControl, FormGroup, NgControl } from '@angular/forms';

@Component({
  selector: 'xnode-chips-input',
  templateUrl: 'chips-input.component.html',
  styleUrls: ['./chips-input.component.css']
})
export class ChipsInputComponent implements OnInit {
  @Input() control!: FormComponent;
  @Input() parentFormGroup!: FormGroup;
TryThis = new FormControl<string[] | null>([
  "Regular study sessions on biology topics",
  "Participation in class discussions to improve engagement",
  "Mindfulness exercises to manage emotional responses in class"
]);
  form: FormGroup  = new FormGroup({
    TryThis: new FormControl<string[] | null>([
      "Regular study sessions on biology topics",
      "Participation in class discussions to improve engagement",
      "Mindfulness exercises to manage emotional responses in class"
  ])
});

  constructor(@Optional() @Self()readonly ngControl: NgControl) {

  }
  ngOnInit(): void {

    console.log('entered:', this.control, this.parentFormGroup)
  }

}

