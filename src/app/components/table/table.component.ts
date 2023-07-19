import { Component, Input, OnInit } from '@angular/core';
import * as dynamictabledata from '../../../assets/json/dynamictabledata.json'

@Component({
  selector: 'xnode-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
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
