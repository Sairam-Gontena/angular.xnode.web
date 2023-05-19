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
  heading: string = "Users";
  editable: boolean | undefined;

  ngOnInit(): void {
    this.editable = false;
    this.dynamicData = dynamicTable?.dynamicTable;
    this.headers = Object.keys(this.dynamicData[0]);
    this.values = Object.values(this.dynamicData)
  }

  editableFunc() {
    if (this.editable == true) {
      this.editable = false;
    } else {
      this.editable = true;
    }
  }
}
