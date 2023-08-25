import { Component, Input, OnInit } from '@angular/core';
import * as dynamictabledata from '../../../assets/json/dynamictabledata.json'
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
interface Column {
  field: string;
  header: string;
}
@Component({
  selector: 'xnode-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {
  cols!: Column[];
  rows: any;
  @Input() dynamicData: any;
  // dynamicData: any;
  headers: any;
  heading: string = "Users";
  editable: boolean = true;
  showSearch: boolean = true;
  showDelete: boolean = true;
  showExport: boolean = true;
  showHeaderMenu: boolean = true;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.dynamicData = dynamictabledata?.dynamicTable?.Invitation;
    const currentUrl = this.router.url;
    if (currentUrl == '/admin/user-invitation') {
      this.cols = dynamictabledata?.dynamicTable?.Invitation?.Columns
      console.log(this.cols)
      this.dynamicData = dynamictabledata?.dynamicTable?.Invitation?.Rows;
    } else if (currentUrl == '/admin/user-approval') {
      this.dynamicData = dynamictabledata?.dynamicTable?.Approvals;
    } else if (currentUrl == '/publish') {
      this.dynamicData = dynamictabledata?.dynamicTable?.PublishTable;
    }
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
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  allValuesTrue(values: any): boolean {
    return Object.values(values).every(value => value === false);
  }
}
