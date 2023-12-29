import { Component, OnInit } from '@angular/core';
import { AppHomePageSideMenuItems } from '../../constants/AppHomePageSideMenuItems';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { UserUtil } from '../../utils/user-util';
import { UtilsService } from '../services/utils.service';
import { environment } from 'src/environments/environment';
import { AuditutilsService } from 'src/app/api/auditutils.service'

@Component({
  selector: 'xnode-homepage-app-side-menu',
  templateUrl: './homepage-app-side-menu.component.html',
  styleUrls: ['./homepage-app-side-menu.component.scss']
})
export class HomepageAppSideMenuComponent {
  sideMenuItems: any;
  selectedMenuIndex: any;
  currentUser?: any;
  href: any;
  currentPath: any;
  constructor(private router: Router, private utils: UtilsService, private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    const environmentName = environment.name as keyof typeof AppHomePageSideMenuItems;
    if (this.currentUser?.role_name === 'Xnode Admin') {
      this.sideMenuItems = AppHomePageSideMenuItems[environmentName].AdminSideMenu;
      this.selectedMenuIndex = 0;
    } else {
      this.sideMenuItems = AppHomePageSideMenuItems[environmentName].UserSideMenu;
    }
    this.activateMenuItem();
  }
  activateMenuItem() {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.currentPath = val.url;
        this.sideMenuItems.map((item: any, index: any) => {
          if ('/' + item.path === this.currentPath) {
            this.selectedMenuIndex = index;
          }
        })
      }
    });
  }
  onClickMenuItem(item: any, i: any): void {
    this.utils.showProductStatusPopup(false);
    if (this.currentUser?.role_name === 'Xnode Admin' && item.label == 'Home') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path])
    } else if (this.currentUser?.role_name === 'Xnode Entity User') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path])
    }
    this.auditUtil.postAudit(item.path, 1, 'SUCCESS', 'user-audit');
  }
}
