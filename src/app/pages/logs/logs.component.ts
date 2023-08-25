import { Component, OnInit } from '@angular/core';
import * as logsTableData from '../../../assets/json/logs.json'

@Component({
  selector: 'xnode-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logsData: any;
  isOpen = true;


  ngOnInit(): void {
    this.logsData = logsTableData?.logs;
  }

}
