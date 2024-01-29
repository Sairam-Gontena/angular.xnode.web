import { Component, OnInit } from '@angular/core';
import TableData from '../../../assets/json/table_columns.json';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { Logs } from 'src/models/logs';
import { Product } from 'src/models/product';
import { TableColumn } from 'src/models/columns';
import { Router } from '@angular/router';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
@Component({
  selector: 'xnode-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  logsData: Array<Logs> = [];
  product?: Product;
  isOpen: any;
  products: Product[] | undefined;
  cols: Array<TableColumn> = TableData.notification_list.Columns;
  tableInfo: any;
  currentUser: any;
  isSideMenuOpen: boolean = true;
  isDockedNaviOpened: boolean = false;
  screenWidth?: number;
  containerWidth?: string = window.innerWidth - 80 + 'px';
  bodyContainerWidth?: string = (window.innerWidth * 80) / 100 - 80 + 'px';

  constructor(
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    public router: Router,
    private naviApiService: NaviApiService,
    private storageService: LocalStorageService
  ) {
    this.utilsService.openSubmenu.subscribe((event: boolean) => {
      // alert("event "+event)
      this.isSideMenuOpen = event;
      this.calculateContainerWidth();
      this.calculateBodyWidth();
    });
    this.utilsService.openDockedNavi.subscribe((info: boolean) => {
      this.isDockedNaviOpened = info;
      this.calculateContainerWidth();
      this.calculateBodyWidth();
    });
  }

  ngOnInit(): void {
    this.calculateContainerWidth();
    this.calculateBodyWidth();
    this.getMeStorageData();
  }

  calculateContainerWidth(): void {
    this.screenWidth = window.innerWidth;
    if (this.isDockedNaviOpened) {
      this.containerWidth = (this.screenWidth * 70) / 100 - 80 + 'px';
    } else {
      this.containerWidth = this.screenWidth - 80 + 'px';
    }
  }
  calculateBodyWidth(): void {
    if (this.isDockedNaviOpened && this.isSideMenuOpen) {
      this.bodyContainerWidth = (window.innerWidth * 50) / 100 - 80 + 'px';
    } else if (this.isSideMenuOpen && !this.isDockedNaviOpened) {
      this.bodyContainerWidth = (window.innerWidth * 80) / 100 - 80 + 'px';
    } else if (!this.isSideMenuOpen && this.isDockedNaviOpened) {
      this.bodyContainerWidth = (window.innerWidth * 70) / 100 - 150 + 'px';
    } else if (!this.isSideMenuOpen && !this.isDockedNaviOpened) {
      this.bodyContainerWidth = window.innerWidth - 130 + 'px';
    }
  }

  getMeStorageData(): void {
    this.utilsService.loadSpinner(true);
    this.products = this.storageService.getItem(StorageKeys.MetaData);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.tableInfo = TableData.notification_list.Table_Info;
    this.getMeLogs();
  }

  getMeLogs(): void {
    let productId: string = '';
    if (!this.product && this.products && this.products.length > 0) {
      productId = this.products[0].id;
      this.product = this.products[0];
    } else {
      if (this.product) productId = this.product?.id;
    }
    localStorage.setItem('record_id', productId);
    this.naviApiService
      .retriveNotifications({
        email: this.currentUser.email,
        productId: productId,
      })
      .then((response: any) => {
        let user_audit_body = {
          method: 'GET',
          url: response?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'NOTIFICATIONS_RETRIEVE_LOGS',
          1,
          'SUCCESS',
          'user-audit',
          user_audit_body,
          this.currentUser?.id,
          this.product?.id
        );
        this.logsData = response.data;
        this.utilsService.loadSpinner(false);
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'GET',
          url: err?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'NOTIFICATIONS_RETRIEVE_LOGS',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser?.email,
          this.product?.id
        );
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: '',
          detail: err,
        });
      });
  }

  onChangeProduct(obj: any): void {
    localStorage.setItem('record_id', obj?.id);
    localStorage.setItem('app_name', obj.title);
    localStorage.setItem(
      'product_url',
      obj.url && obj.url !== '' ? obj.url : ''
    );
    this.storageService.saveItem(StorageKeys.Product, obj);
    this.getMeStorageData();
  }

  sideMenuToggle(val: boolean): void {
    this.isOpen = val;
  }
}
