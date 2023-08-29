import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshListService } from '../../RefreshList.service';
import { ApiService } from 'src/app/api/api.service';
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
    this.utilsService.loadSpinner(true)
    if (action.type === 'invite') {
      this.updateUserId(action.id, 'invited')
    } else if (action.type === 'hold') {
      this.updateUserId(action.id, 'hold')

    } else if (action.type === 'reject') {
      this.updateUserId(action.id, 'rejected')

    }
  }
  updateUserId(id: string, action: string): void {
    let url = 'auth/beta/update_user/' + 'dev.xnode@salientminds.com'
    let body = {
      "id": id,
      "action": action
    }
    this.apiService.authPut(body, url)
      .then((response: any) => {
        if (response?.status === 200) {
          if (response?.data) {
            this.refreshListService.toggleAdminUserListRefresh();
          } else {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          }
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        }
        this.utilsService.loadSpinner(false)

      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
        this.utilsService.loadSpinner(false)

      });

  }
}
