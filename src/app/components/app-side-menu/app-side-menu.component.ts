import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { UserUtil, User } from '../../utils/user-util';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss']
})
export class AppSideMenuComponent implements OnInit {
  sideMenuItems: any;
  selectedMenuIndex: any;
  currentUser?: User;
  href: any;
  constructor(private router: Router, private utils: UtilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.currentUser?.role === 'admin') {
      this.sideMenuItems = AppSideMenuItems.AdminSideMenu;
      this.selectedMenuIndex = 0;
    } else {
      this.sideMenuItems = AppSideMenuItems.UserSideMenu;
    }
  }

  onClickMenuItem(item: any, i: any): void {
    this.utils.showProductStatusPopup(false);
    if (this.currentUser?.role?.toUpperCase() === 'ADMIN' && item.label == 'Home') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path])
    } else if (this.currentUser?.role?.toUpperCase() === 'USER') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path])
    }

  }
}
