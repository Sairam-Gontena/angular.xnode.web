import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'

@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  headerItems: any;

  constructor() {

  }

  ngOnInit(): void {
    this.headerItems = HeaderItems;
  }

}
