import { Component, OnInit, Input } from '@angular/core';
import *as data from '../../constants/overview.json';
@Component({
  selector: 'xnode-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {
  stepNumber = 0;
  isLast = false;
  isFirst = false;
  currentStep = 1;
  active: any;
  item: any;
  jsondata: any;
  @Input() status: any;

  constructor() {
  }

  ngOnInit() {
  }
}
