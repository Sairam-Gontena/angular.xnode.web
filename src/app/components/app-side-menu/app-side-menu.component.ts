import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { UserUtil, User } from '../../utils/user-util';

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
  constructor(private router: Router, private route: ActivatedRoute, private location: Location) {
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
    this.selectedMenuIndex = i;
    this.router.navigate(['/' + item.path])
  }
}
