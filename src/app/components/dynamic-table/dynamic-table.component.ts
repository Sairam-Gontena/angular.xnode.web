import { Component, OnInit } from '@angular/core';

import dynamicTable from '../../../assets/json/dynamic-table.json'


@Component({
  selector: 'xnode-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {

  dynamicData: any;
  headers: any;
  values: any;

  ngOnInit(): void {
    this.dynamicData = dynamicTable?.dynamicTable;

    this.headers = Object.keys(this.dynamicData[0]);
    this.values = Object.values(this.dynamicData)
  }

  parseFieldInData(data: any, field: string) {
    return data.field;
  }

}
