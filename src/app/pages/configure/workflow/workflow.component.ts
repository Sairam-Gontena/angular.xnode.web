import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {
  getconfigureLayout: any;
  getOperateLayout: any;
  layout: any;
  dashboard: any  = 'Overview';
  layoutColumns: any;
  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  operateLayout: any;
  data: any;
  doughnutData: any;
  doughnutOptions: any;
  options: any;

  constructor(public router: Router){}

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
   
    }

  getLayout(layout: any): void {
    console.log(layout);
    this.dashboard = layout;
    // if (layout)
    //   this.dashboard = this.layoutColumns[layout];
    //   console.log(layout)
  }

  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
  }

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }
  onboarding(){
    this.router.navigate(['configuration/onboardingWF']);
  }
  login(){
    this.router.navigate(['configuration/loginWF']);
  }
}
