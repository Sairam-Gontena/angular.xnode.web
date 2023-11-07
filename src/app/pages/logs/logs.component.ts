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

  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    public router: Router
  ) {
    this.utilsService.openSubmenu.subscribe((event: boolean) => {
      this.isSideMenuOpen = event;
    })
    this.utilsService.openDockedNavi.subscribe((info: boolean) => {
      this.isDockedNaviOpened = info
    })
    this.utilsService.getMeIfProductChanges.subscribe((info: boolean) => {
      if (info) {
        this.getStorageData();
      }
    })

  }

  ngOnInit(): void {
    this.getStorageData();
  }

  getStorageData(): void {
    const metaData = localStorage.getItem('meta_data');
    let product = localStorage.getItem('product');
    console.log('product', product);

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


}
