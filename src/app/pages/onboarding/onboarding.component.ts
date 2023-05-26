import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { WorkspaceComponent } from '../../components/workspace/workspace.component';
import { BrandGuidelinesComponent } from '../../components/brand-guidelines/brand-guidelines.component';
@Component({
  selector: 'xnode-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  // @ViewChild(WorkspaceComponent) workspaceComponent: WorkspaceComponent;

  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;

  selectedCategory: any = null;

  categories: any[] = [
    { name: 'For Personal', key: 'P' },
    { name: 'For Commercial', key: 'C' },
    { name: 'Others', key: 'O' }
  ];

  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }
  workspaceStep() {
    this.stepTwo = true;
    this.stepThree = false;
    this.stepFour = false;
    this.stepOne = false;
  }
  guidelineStep() {
    this.stepTwo = false;
    this.stepThree = true;
    this.stepOne = false;
    this.stepFour = false;

  }
  aboutStep() {
    this.stepFour = true;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepOne = false;
  }


}
