import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as FileSaver from 'file-saver';

interface Column {
  field: string;
  header: string;
}
interface FilterOptions {
  showFilterOption?: boolean;
  filter: boolean;
  showToggleAll: boolean;
  showHeader: boolean;
  options: any[];
  placeholder: string;
  optionLabel: string;
  styleClass: string;
  changeHandler?: (event: any) => void;
}
@Component({
  selector: 'xnode-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit {
  rows: any;
  @Input() dynamicData: any;
  @Input() inputData: any;
  @Input() cols: any[] = [];
  @Input() Actions: any[] = [];
  @Input() DeleteAction: any[] = [];
  @Input() tableInfo: any;
  @Input() columnWidth: string = "18rem";
  @Input() tableHeaderColor: string = ''
  @Input() altBgColorRow: string='';
  @Input() verticalScrollHeight = "25rem"

  @Input() showRows!: number;
  @Input() totalRecordsCount!: number;

  @Input() searchFilterOptions: FilterOptions = {
    showFilterOption: false,
    filter: false,
    showToggleAll: false,
    showHeader: false,
    options: [],
    placeholder: "All",
    optionLabel: "name",
    styleClass: "custom-multiselect"
  }

  @Input() showColumnFilterOption: FilterOptions = {
    showFilterOption: false,
    filter: false,
    showToggleAll: false,
    showHeader: false,
    options: [],
    placeholder: "All",
    optionLabel: "name",
    styleClass: "showColumnFilterOption",
    changeHandler: (event: any): void => {console.log('val')}
  }


  headers: any;
  editable: boolean = true;
  showDelete: boolean = true;
  showHeaderMenu: boolean = true;
  userDetails: any;
  tableData: any;
  showConfirmationPopover: boolean = false;
  exportFileName: any;

  products?: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputData']?.currentValue) {
      this.dynamicData = changes['inputData'].currentValue;
      this.tableData = changes['inputData'].currentValue;
    }
    if (changes['tableInfo']?.currentValue) {
      this.exportFileName =
        changes['tableInfo']?.currentValue.name + new Date().getTime();
    }
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

  onCellInputBlur(event: any) {}

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  allValuesTrue(values: any): boolean {
    return Object.values(values).every((value) => value === false);
  }
  handleDataAndAction(data: any) {
    this.showConfirmationPopover = true;
    this.userDetails = data;
  }
  onClickAction(action: any): void {}

  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.dynamicData = this.tableData.filter((obj: any) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
          if (obj[key].toLowerCase().includes(inputValue.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });
  }

  exportExcelData() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.dynamicData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, this.tableInfo.name);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, this.exportFileName);
  }

   // Function to handle lazy loading (pagination)
   onPageChangeHandler(event: any) {
    console.log(event, "event")

    // Emit event to parent
  }
}
