import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';

@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss']
})
export class AppSideMenuComponent implements OnInit {

  sideMenuItems: any;
  selectedMenuIndex: any;

  ngOnInit(): void {
    this.sideMenuItems = AppSideMenuItems;
    this.selectedMenuIndex = 2;
  }

  onClickMenuItem(e: any): void {
    this.selectedMenuIndex = e.index;
  }

}
