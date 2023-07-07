import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'



@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  headerItems: any;
  values: any;
  selectedValue: any;

  constructor() {

  }

  ngOnInit(): void {
    this.headerItems = HeaderItems;
    this.values = [
      { name: 'Rymond Nelson', code: 'NY' },
      { name: 'Logout', code: 'lg' }
    ];
  }

  onOptionSelected(value: any) {
    if (value.code == 'lg') {
      localStorage.clear();
      window.location.href = '/';
    }
  }

}
