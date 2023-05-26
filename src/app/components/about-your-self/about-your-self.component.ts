import { Component } from '@angular/core';

@Component({
  selector: 'xnode-about-your-self',
  templateUrl: './about-your-self.component.html',
  styleUrls: ['./about-your-self.component.scss']
})
export class AboutYourSelfComponent {

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
