import { Component, OnInit } from '@angular/core';
import TableData from '../../../assets/json/table_logs.json'
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'xnode-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logsData: any;
  isOpen = true;
  cols: any;


  constructor(private apiService: ApiService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.cols = TableData.Columns;
    let localItem = localStorage.getItem('currentUser')
    if (localItem) {
      let user = JSON.parse(localItem);
      this.utilsService.loadSpinner(true)
      this.apiService.getApi('notifications/retrieve/' + environment.branchName + '?email=' + user?.email + '&product_id=' + localStorage.getItem('record_id')).then((response: any) => {
        this.logsData = response.data;
        let mapData: any[] = [];
        this.logsData.map((item: any) => {
          mapData.push(item.notification_message)
        })
        this.logsData = mapData;
        this.utilsService.loadSpinner(false)
      }).catch((err: any) => {
        console.log(err);
        this.utilsService.loadSpinner(false)
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: err });
      })
    }
  }

}
