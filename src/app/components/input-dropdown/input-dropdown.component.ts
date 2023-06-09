import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'xnode-input-dropdown',
  templateUrl: './input-dropdown.component.html',
  styleUrls: ['./input-dropdown.component.scss']
})
export class InputDropdownComponent implements OnInit {
  cities: City[]; 
  @Input() dropDown: FormGroup;

 
constructor(){
  this.cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];
this.dropDown = new FormGroup('', Validators.required);

}
  ngOnInit() { 
}
}
