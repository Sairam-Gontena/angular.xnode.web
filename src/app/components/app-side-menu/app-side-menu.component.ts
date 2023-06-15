import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss']
})
export class AppSideMenuComponent implements OnInit {
  sideMenuItems: any;
  selectedMenuIndex: any;
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.sideMenuItems = AppSideMenuItems;
    this.selectedMenuIndex = 2;
  }

  onClickMenuItem(item: any, i: any): void {
    this.selectedMenuIndex = i;
    this.router.navigate(['/' + item.path])
  }

}
