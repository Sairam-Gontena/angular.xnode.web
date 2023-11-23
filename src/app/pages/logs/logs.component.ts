import { Component, OnInit } from '@angular/core';
import TableData from '../../../assets/json/table_columns.json';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { Logs } from 'src/models/logs';
import { Product } from 'src/models/product';
import { TableColumn } from 'src/models/columns';
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})

export class LogsComponent implements OnInit {
  logsData: Array<Logs> = [];
  product?: Product;
  products: Array<Product> = [];
  cols: Array<TableColumn> = TableData.notification_list.Columns;
  tableInfo: any;
  email: string = '';
  productId: string = '';
  isSideMenuOpen: boolean = true
  isDockedNaviOpened: boolean = false;
  screenWidth?: number
  containerWidth?: string = (window.innerWidth - 80) + 'px';
  bodyContainerWidth?: string = (((window.innerWidth * 80) / 100) - 80) + 'px';
  // isSideMenuOpen?: boolean = false;

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    public router: Router
  ) {
    this.utilsService.openSubmenu.subscribe((event: boolean) => {
      // alert("event "+event)
      this.isSideMenuOpen = event;
      this.calculateContainerWidth();
      this.calculateBodyWidth();
    })
    this.utilsService.openDockedNavi.subscribe((info: boolean) => {
      this.isDockedNaviOpened = info
      this.calculateContainerWidth();
      this.calculateBodyWidth();
    })
  }

  ngOnInit(): void {
    this.calculateContainerWidth()
    this.calculateBodyWidth();
    this.getMeStorageData();
  }

  calculateContainerWidth(): void {
    this.screenWidth = window.innerWidth;
    if (this.isDockedNaviOpened) {
      this.containerWidth = (((this.screenWidth * 70) / 100) - 80) + 'px';
    } else {
      this.containerWidth = (this.screenWidth - 80) + 'px';
    }
  }
  calculateBodyWidth(): void {
    if (this.isDockedNaviOpened && this.isSideMenuOpen) {
      this.bodyContainerWidth = (((window.innerWidth * 50) / 100) - 80) + 'px';
    }
    else if (this.isSideMenuOpen && !this.isDockedNaviOpened) {
      this.bodyContainerWidth = (((window.innerWidth * 80) / 100) - 80) + 'px';
    }
    else if (!this.isSideMenuOpen && this.isDockedNaviOpened) {
      this.bodyContainerWidth = (((window.innerWidth * 70) / 100) - 150) + 'px';
    }
    else if (!this.isSideMenuOpen && !this.isDockedNaviOpened) {
      this.bodyContainerWidth = (window.innerWidth - 130) + 'px';
    }
  }

  getMeStorageData(): void {
    this.utilsService.loadSpinner(true);
    const metaData = localStorage.getItem('meta_data');
    let product = localStorage.getItem('product');
    let currentUser = localStorage.getItem('currentUser');
    this.utilsService.loadSpinner(true);
    this.tableInfo = TableData.notification_list.Table_Info;
    if (product) {
      this.product = JSON.parse(product)
    }
    if (currentUser) {
      this.email = JSON.parse(currentUser)?.email;
    }
    if (metaData) {
      this.products = JSON.parse(metaData);
    }
    this.getMeLogs();
  }

  getMeLogs(): void {
    let prod_id: string = '';
    if (!this.product) {
      prod_id = this.products[0].id;
      this.product = this.products[0];
    } else {
      prod_id = this.product.id;
    }
    localStorage.setItem('record_id', prod_id);
    this.apiService.getApi('notifications/retrieve/' + environment.branchName + '?email=' + this.email + '&product_id=' + prod_id).then((response: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': response?.request?.responseURL
      }
      this.auditUtil.postAudit('NOTIFICATIONS_RETRIEVE_LOGS', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
      this.logsData = response.data;
      this.utilsService.loadSpinner(false)
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': err?.request?.responseURL
      }
      this.auditUtil.postAudit('NOTIFICATIONS_RETRIEVE_LOGS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utilsService.loadSpinner(false)
      this.utilsService.loadToaster({ severity: 'error', summary: '', detail: err });
    })
  }

  onChangeProduct(obj: any): void {
    localStorage.setItem('record_id', obj?.id);
    localStorage.setItem('app_name', obj.title);
    localStorage.setItem('product_url', obj.url && obj.url !== '' ? obj.url : '');
    localStorage.setItem('product', JSON.stringify(obj));
    this.getMeStorageData();
  }

  sideMenuToggle(val: boolean): void {
    this.calculateContainerWidth();
    this.calculateBodyWidth();
  }

}
