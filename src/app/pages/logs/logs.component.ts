import { Component, OnInit } from '@angular/core';
import TableData from '../../../assets/json/table_columns.json';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
import { AuditutilsService } from 'src/app/api/auditutils.service';
@Component({
  selector: 'xnode-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logsData: any;
  cols: any;
  tableInfo: any;
  email: any;
  productId: any;
  isSideMenuOpen: boolean = true
  isDockedNaviOpened: boolean = false;

  constructor(private apiService: ApiService, private utilsService: UtilsService, private auditUtil: AuditutilsService) {
    let product = localStorage.getItem('product')
    if (product) {
      let productObj = JSON.parse(product)
      this.productId = productObj?.id;
    }
  }

  ngOnInit(): void {
    this.cols = TableData.notification_list.Columns;
    this.tableInfo = TableData.notification_list.Table_Info;
    let localItem = localStorage.getItem('currentUser')
    if (localItem) {
      let user = JSON.parse(localItem);
      this.email = user?.email;
      this.utilsService.loadSpinner(true)
      this.apiService.getApi('notifications/retrieve/' + environment.branchName + '?email=' + user?.email).then((response: any) => {
        let user_audit_body = {
          'method': 'GET',
          'url': response?.request?.responseURL
        }
        this.auditUtil.post('NOTIFICATIONS_RETRIEVE_LOGS', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        this.logsData = response.data;
        this.utilsService.loadSpinner(false)
      }).catch((err: any) => {
        let user_audit_body = {
          'method': 'GET',
          'url': err?.request?.responseURL
        }
        this.auditUtil.post('NOTIFICATIONS_RETRIEVE_LOGS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utilsService.loadSpinner(false)
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: err });
      })
      this.utilsService.openSubmenu.subscribe((data: any) => {
        this.isSideMenuOpen = data;
      })
    }
    this.utilsService.openDockedNavi.subscribe((info) => {
      this.isDockedNaviOpened = info
    })
  }


}
