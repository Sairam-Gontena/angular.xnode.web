import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'xnode-input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.scss']
})
export class InputRadioComponent implements OnInit {

  categories: any[] = [
      { name: 'Make', key: 'M' },
      { name: 'Female', key: 'F' },
      
  ];
  
  @Input() radioButton: FormGroup;

  constructor() {
    this.radioButton = new FormGroup('', Validators.required);
    
  }
  ngOnInit() {
  
  }
}
