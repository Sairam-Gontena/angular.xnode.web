import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
  @Input() Actions: any[] = [];
  @Input() DeleteAction: any[] = [];
  @Input() tableInfo: any
  headers: any;
  editable: boolean = true;
  showDelete: boolean = true;
  showHeaderMenu: boolean = true;
  userDetails: any;
  tableData: any;
  showConfirmationPopover: boolean = false;

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
  handleDataAndAction(data: any) {
    this.showConfirmationPopover = true;
    this.userDetails = data;
  }
  onClickAction(action: any): void {

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
