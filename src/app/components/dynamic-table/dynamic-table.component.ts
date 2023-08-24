import { Component, Input, OnInit } from '@angular/core';
import * as dynamictabledata from '../../../assets/json/dynamictabledata.json'
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
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
  showSearch: boolean = true;
  showDelete: boolean = true;
  showExport: boolean = true;
  showHeaderMenu: boolean = true;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.dynamicData = dynamictabledata?.dynamicTable?.Invitation;
    const currentUrl = this.router.url;
    if (currentUrl == '/admin/userinvitation') {
      this.dynamicData = dynamictabledata?.dynamicTable?.Invitation;
    } else if (currentUrl == '/admin/userapproval') {
      this.dynamicData = dynamictabledata?.dynamicTable?.Approvals;
    } else if (currentUrl == '/publish') {
      this.dynamicData = dynamictabledata?.dynamicTable?.PublishTable;
    } else {
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
