import { Component,Input, OnInit } from '@angular/core';
import * as dynamictabledata from '../../../assets/json/dynamictabledata.json'

@Component({
  selector: 'xnode-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  dynamicData: any;

  headers: any;

  values: any;

  heading: string = "Users";

  public editable: boolean = true;

  public notEditable: boolean = false;

  ngOnInit(): void {

    this.dynamicData = dynamictabledata?.dynamicTable;

    this.headers = Object.keys(this.dynamicData[0]);
    console.log(this.headers)

    this.values = Object.values(this.dynamicData)

  }




  constructor() {

  }





  editableFunc() {

    if (this.editable) {

      this.editable = false;

      this.notEditable = true;

    } else {

      this.editable = true;

      this.notEditable = false;

    }

  }




  onCellInputBlur(event: any) {

    console.log(event.target.id)

    console.log(event.target.value)

  }




  onCellEditComplete(event: any) {

    const editedRowData = event.data; // edited row data

    const editedColumnField = event.field; // edited column field

    const newValue = event.field[event.field]; // new value

    console.log(editedRowData)

    console.log(editedColumnField)

    console.log(newValue)

  }


}
