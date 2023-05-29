import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xnode-about-your-self',
  templateUrl: './about-your-self.component.html',
  styleUrls: ['./about-your-self.component.scss']
})
export class AboutYourSelfComponent {

  constructor() { }
  selectedCategory: any = null;

  categories: any[] = [
    { name: 'For Personal', key: 'P' },
    { name: 'For Commercial', key: 'C' },
    { name: 'Others', key: 'O' }
  ];

  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }
}
