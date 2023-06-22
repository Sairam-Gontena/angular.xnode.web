import { Component, OnInit } from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
  }

  ngDoCheck() {
    console.log(`ngDoCheck: ${this.stepNumber}`);
  }
}
