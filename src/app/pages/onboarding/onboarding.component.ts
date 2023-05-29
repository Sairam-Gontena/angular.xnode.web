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
  categories: any[] = [
    { name: 'For Personal', key: 'P' },
    { name: 'For Commercial', key: 'C' },
    { name: 'Others', key: 'O' }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.stepData = data.type;
    })
    this.selectedCategory = this.categories[0];
    localStorage.removeItem('currentUser');
  }
}
