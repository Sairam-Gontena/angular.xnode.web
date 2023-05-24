import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { BrandGuidelinesComponent } from '../brand-guidelines/brand-guidelines.component';
@Component({
  selector: 'xnode-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  // @ViewChild(WorkspaceComponent) workspaceComponent: WorkspaceComponent;

  showContent: boolean = true;
  showContent1: boolean = false;
  showContent2: boolean = false;
  showContent3: boolean = false;

  selectedCategory: any = null;

  categories: any[] = [
    { name: 'For Personal', key: 'P' },
    { name: 'For Commercial', key: 'C' },
    { name: 'Others', key: 'O' }
  ];

  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }
  toggleContent() {
    this.showContent1 = true;
    this.showContent2 = false;
    this.showContent3 = false;
    this.showContent = false;
  }
  toggleContent1() {
    this.showContent1 = false;
    this.showContent2 = true;
    this.showContent = false;
    this.showContent3 = false;

  }
  toggleContent2() {
    this.showContent3 = true;
    this.showContent1 = false;
    this.showContent2 = false;
    this.showContent = false;
  }
  toggleContent3() {
    // this.showContent3 = true;
    // this.showContent1 = false;
    // this.showContent2 = false;
    // this.showContent = true;
  }

}
