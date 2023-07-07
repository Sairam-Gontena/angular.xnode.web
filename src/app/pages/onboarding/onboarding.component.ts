import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xnode-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  template: '<router-outlet></router-outlet>'
})
export class OnboardingComponent implements OnInit {
  stepData: any;
  selectedCategory: any = null;
  h_full_true: boolean = false;
  categories: any[] = [
    { name: 'For Personal', key: 'P' },
    { name: 'For Commercial', key: 'C' },
    { name: 'Others', key: 'O' }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.stepData = data.type;
      data?.type == "Workspace" || data?.type == "AboutYourSelf" || data?.type == "ExportGetStarted" ? this.h_full_true = true : this.h_full_true = false;
    })
    this.selectedCategory = this.categories[0];
  }
}
