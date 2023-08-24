import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss']
})
export class AppSideMenuComponent implements OnInit {
  sideMenuItems: any;
  selectedMenuIndex: any;
  href: any;
  constructor(private router: Router, private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url == '/admin/userinvitation' || event.url == '/admin/userapproval') {
          this.sideMenuItems = AppSideMenuItems.AdminSideMenu;
        } else {
          this.sideMenuItems = AppSideMenuItems.UserSideMenu;
        }
      }
    });
    this.selectedMenuIndex = 2;
    this.sideMenuItems.map((item: any, index: any) => {
      let href = this.location.path();
      if ("/" + item?.path == href) {
        this.selectedMenuIndex = index;
      }
    });
  }

  onClickMenuItem(item: any, i: any): void {
    this.selectedMenuIndex = i;
    this.router.navigate(['/' + item.path])
  }
}
