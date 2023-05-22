import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
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
  public editable: boolean = false;
  public notEditable: boolean = true;
  ngOnInit(): void {
    this.dynamicData = dynamicTable?.dynamicTable;
    this.headers = Object.keys(this.dynamicData[0]);
    this.values = Object.values(this.dynamicData)
  }

  constructor(private cdr: ChangeDetectorRef) {
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
