import { Component, OnInit } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { UserUtil, User } from '../../utils/user-util';
import { UtilsService } from '../services/utils.service';
import { environment } from 'src/environments/environment';
import { AuditutilsService } from '../../api/auditUtils.service';


@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss']
})
export class AppSideMenuComponent implements OnInit {
  sideMenuItems: any;
  selectedMenuIndex: any;
  currentUser?: any;
  href: any;
  constructor(private router: Router, private utils: UtilsService, private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    const environmentName = environment.name as keyof typeof AppSideMenuItems;
    if (this.currentUser?.role_id === 'Xnode Admin') {
      this.sideMenuItems = AppSideMenuItems[environmentName].AdminSideMenu;
      this.selectedMenuIndex = 0;
    } else {
      this.sideMenuItems = AppSideMenuItems[environmentName].UserSideMenu;
    }
  }

  onClickMenuItem(item: any, i: any): void {
    this.utils.showProductStatusPopup(false);
    if (this.currentUser?.role_id === 'Xnode Admin' && item.label == 'Home') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path])
    } else if (this.currentUser?.role_id === 'Xnode Entity User') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path])
    }
    this.auditUtil.post(item.path, 1, 'SUCCESS', 'user-audit');
  }
}
