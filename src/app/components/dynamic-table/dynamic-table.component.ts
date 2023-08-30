import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshListService } from '../../RefreshList.service';
import { ApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
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

  rows: any;
  @Input() dynamicData: any;
  @Input() inputData: any;
  @Input() cols: any[] = [];
  headers: any;
  editable: boolean = true;
  showSearch: boolean = true;
  showDelete: boolean = true;
  showExport: boolean = true;
  showHeaderMenu: boolean = true;
  userDetails: any;
  tableData: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.dynamicData = this.inputData;
    this.tableData = this.inputData;
  }

  ngOnInit(): void {
    this.loadTableData(this.inputData);
  }

  private loadTableData(data: any): void {
    this.dynamicData = data;
    if (this.dynamicData) {
      this.headers = Object.keys(this.dynamicData[0]);
    }
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
  onClickAction(action: any): void {
    this.userDetails = action;
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.dynamicData = this.tableData.filter((obj: any) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
          if (obj[key].includes(inputValue)) {
            return true;
          }
        }
      }
      return false;
    });

  }

}
