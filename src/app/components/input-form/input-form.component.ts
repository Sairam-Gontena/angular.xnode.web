import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'xnode-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent {
  
  myForm! : FormGroup;
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit() {
    this.myForm = this.fb.group({
      // name: [''],
      // address: this.fb.group({ // create nested formgroup to pass to child
        name: ['',Validators.required],
        phone: ['',Validators.required],
      // }),
      // textArea: this.fb.group({
        summary: ['',Validators.required],
      // })
      city: ['', Validators.required],
      cityName: ['', Validators.required],
      gender: ['', Validators.required],
    })
  }
}
