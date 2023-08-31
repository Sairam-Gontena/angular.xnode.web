import { Component, OnInit } from '@angular/core';
import TableData from '../../../assets/json/table_logs.json'
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
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
      this.apiService.getApi('notifications/retrieve/dev?email=' + user?.email).then((response: any) => {
        this.logsData = response.data;
        let mapData: any[] = [];
        this.logsData.map((item: any) => {
          mapData.push(item.notification_message)
        })
        this.logsData = mapData;
      }).catch((err: any) => {
        console.log(err);
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: err });
      })
    }
  }

}
