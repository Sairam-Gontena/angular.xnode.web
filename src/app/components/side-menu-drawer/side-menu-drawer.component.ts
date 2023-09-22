import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppSideMenuItems } from 'src/app/constants/AppSideMenuItems';
import { UserUtil } from 'src/app/utils/user-util';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { NgxCaptureService } from 'ngx-capture';

@Component({
  selector: 'xnode-side-menu-drawer',
  templateUrl: './side-menu-drawer.component.html',
  styleUrls: ['./side-menu-drawer.component.scss']
})
export class SideMenuDrawerComponent implements OnInit {
  @Input() sidebarVisible: any;
  @Output() hideSideMenuDrawer = new EventEmitter<any>();
  currentUser?: any;
  sideMenuItems: any;
  selectedMenuIndex: any;
  product_id: any;

  constructor(
    private router: Router,
    private utils: UtilsService,
    private auditUtils: AuditutilsService,
    private captureService: NgxCaptureService
  ) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.utils.getMeSelectedProduct.subscribe(event => {
      if (event) {
        this.product_id = event.id;
        this.prepareSideMenu();
      } else {
        this.product_id = undefined;
      }
    })
  }

  prepareSideMenu(): void {
    const environmentName = environment.name as keyof typeof AppSideMenuItems;
    if (this.currentUser?.role_name === 'Xnode Admin') {
      this.sideMenuItems = AppSideMenuItems[environmentName].AdminSideMenu;
      this.selectedMenuIndex = 0;
    } else {
      this.sideMenuItems = AppSideMenuItems[environmentName].UserSideMenu;
    }
  }
  onClickHelpCenter(): void {
    this.hideSideMenuDrawer.emit();
    this.router.navigate(['/help-center']);
    this.utils.showProductStatusPopup(false);
    this.utils.showLimitReachedPopup(false);
    this.auditUtils.post('HELP_CENTER', 1, 'SUCCESS', 'user-audit');
  }

  onClickLogout(): void {
    this.hideSideMenuDrawer.emit();
    localStorage.clear();
    this.router.navigate(['/']);
  }

  onClickFeedback(): void {
    this.utils.loadSpinner(true);
    this.auditUtils.post('FEEDBACK', 1, 'SUCCESS', 'user-audit');
    this.utils.showProductStatusPopup(false);
    this.utils.showLimitReachedPopup(false);
  }


  onClickMenuItem(item: any, i: any): void {
    this.utils.showProductStatusPopup(false);
    this.hideSideMenuDrawer.emit(true);
    if (this.currentUser?.role_name === 'Xnode Admin' && item.label == 'Home') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path])
    } else if (this.currentUser?.role_name === 'Xnode Entity User') {
      this.selectedMenuIndex = i;
      this.router.navigate(['/' + item.path])
    }
    this.auditUtils.post(item.path, 1, 'SUCCESS', 'user-audit');
  }

  onClickLog() {
    this.hideSideMenuDrawer.emit(true);
    this.utils.saveSelectedProduct(false);
    this.router.navigate(['/my-products'])
  }
}
