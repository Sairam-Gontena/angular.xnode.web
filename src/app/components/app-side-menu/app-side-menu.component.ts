import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { UserUtil } from '../../utils/user-util';
import { UtilsService } from '../services/utils.service';
import { environment } from 'src/environments/environment';
import { AuditutilsService } from 'src/app/api/auditutils.service';

@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss'],
})
export class AppSideMenuComponent implements OnInit {
  sideMenuItems: any;
  selectedMenuIndex: any;
  currentUser?: any;
  href: any;
  currentPath: any;
  isInProductContext: boolean = false;
  constructor(
    private router: Router,
    private utils: UtilsService,
    private auditUtil: AuditutilsService
  ) {
    this.currentUser = UserUtil.getCurrentUser();
    this.utils.isInProductContext.subscribe((data: any) => {
      this.isInProductContext = data;
      this.prepareMenuBasedOnRoute();
    });
  }

  ngOnInit(): void {
    this.prepareMenuBasedOnRoute();
  }

  prepareMenuBasedOnRoute(): void {
    if (!this.isInProductContext) {
      this.sideMenuItems = [
        {
          label: 'Home',
          icon: './assets/home.svg',
          path: 'my-products',
        },
        {
          label: 'Knowledge',
          icon: './assets/accounts.svg',
          path: 'admin/user-approval',
        },
      ];
      this.activateMenuItem();
    } else {
      const environmentName = environment.name as keyof typeof AppSideMenuItems;
      if (this.currentUser?.role_name === 'Xnode Admin') {
        this.sideMenuItems = AppSideMenuItems[environmentName].AdminSideMenu;
        this.selectedMenuIndex = 0;
      } else {
        this.sideMenuItems = AppSideMenuItems[environmentName].UserSideMenu;
      }
    }
  }
  activateMenuItem() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentPath = val.url;
        this.sideMenuItems.map((item: any, index: any) => {
          if ('/' + item.path === this.currentPath) {
            this.selectedMenuIndex = index;
          }
        });
      }
    });
  }
  onClickMenuItem(item: any, i: any): void {
    this.utils.showProductStatusPopup(false);
    if (this.currentUser?.role_name === 'Xnode Admin' && item.label == 'Home') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path]);
    } else if (this.currentUser?.role_name === 'Xnode Entity User') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path]);
    }
    // this.utils.disableDockedNavi();
    this.auditUtil.postAudit(item.path, 1, 'SUCCESS', 'user-audit');
  }
}
