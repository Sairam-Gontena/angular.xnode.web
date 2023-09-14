import { Component, OnInit } from '@angular/core';
import TableData from '../../../assets/json/table_logs.json'
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
  isOpen = true;
  cols: any;


  constructor(private apiService: ApiService, private utilsService: UtilsService, private auditUtil: AuditutilsService) { }

  ngOnInit(): void {
    this.cols = TableData.Columns;
    let localItem = localStorage.getItem('currentUser')
    if (localItem) {
      let user = JSON.parse(localItem);
      this.utilsService.loadSpinner(true)
      this.apiService.getApi('notifications/retrieve/' + environment.branchName + '?email=' + user?.email).then((response: any) => {
        let user_audit_body = {
          'method': 'GET',
          'url': response?.request?.responseURL
        }
        this.auditUtil.post('NOTIFICATIONS_RETRIEVE', 1, 'SUCCESS', 'user-audit', user_audit_body);
        this.logsData = response.data;
        this.utilsService.loadSpinner(false)
      }).catch((err: any) => {
        console.log(err);
        this.utilsService.loadSpinner(false)
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: err });
      })
    }
  }

}
