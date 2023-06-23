import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import *as data from '../../constants/overview.json';
import { text } from 'd3';

@Component({
  selector: 'xnode-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent {
  @Input() currentStep: number = 2;

  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  iconClicked: any;
  stepper: any;
  show = false;
  counter: any = 1;
  counter2: any = 1;
  jsondata: any;
  status: any;
  item: any;
  active: any;

  ngOnInit(): void {
    this.jsondata = data?.data;
    console.log(this.jsondata);

    console.log(this.jsondata[3].children[0][" title"])

    this.templates = [
      { label: 'FinBuddy' }
    ]
  }
  ;
  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
    this.iconClicked.emit(icon);
  }
  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }


  nextStep(): void {
    // this.stepper.nextStep();
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.counter++;
  }

  prevStep(): void {
    this.stepper.prevStep();
    this.counter--;
  }

  setStep(step: any) {
    // this.stepperRef.setStep(step);
    this.counter = step;
  }

  nextStep2() {
    this.stepper.nextStep();
    this.counter2++;
  }

  prevStep2() {
    this.stepper.prevStep();
    this.counter2--;
  }

  setStep2(step: any) {
    // this.stepperRef.setStep(step);
    this.counter2 = step;
  }
}

