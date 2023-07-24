import { Component, Input, OnInit } from '@angular/core';
import * as dynamictabledata from '../../../assets/json/dynamictabledata.json'

@Component({
  selector: 'xnode-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {
  dynamicData: any;
  headers: any;
  heading: string = "Users";
  editable: boolean = true;

  ngOnInit(): void {
    this.dynamicData = dynamictabledata?.dynamicTable;
    this.headers = Object.keys(this.dynamicData[0]);
  }

  onClickCellEdit() {
    if (this.editable) {
      this.editable = false;
    } else {
      this.editable = true;
    }
  }

  onCellInputBlur(event: any) {
  }



}
