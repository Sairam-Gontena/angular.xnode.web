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


  constructor(private router: Router, private refreshListService: RefreshListService, private apiService: ApiService, private utilsService: UtilsService,) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dynamicData = this.inputData;
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


}
