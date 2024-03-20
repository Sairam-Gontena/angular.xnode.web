import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Data } from './class/data';
import { Router } from '@angular/router';
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';
import { UtilService } from './service/util.service';
import { User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { NaviApiService } from 'src/app/api/navi-api.service';
@Component({
  selector: 'xnode-er-modeller',
  templateUrl: './er-modeller.component.html',
  styleUrls: ['./er-modeller.component.scss'],
  providers: [DataService, JsPlumbService, UtilService, MessageService],
})
export class ErModellerComponent implements AfterViewChecked, OnInit {
  data: Data | any;
  bpmnSubUrl: boolean = false;
  dashboard: any;
  layoutColumns: any;
  loading: boolean = true;
  selectedTemplate = localStorage.getItem('app_name');
  highlightedIndex: string | null = null;
  isOpen = true;
  id: String = '';
  currentUser?: User;
  dataModel: any;
  product: any;
  product_id: any;
  @Input() erModelInput: any;
  productChanged: boolean = false;

  constructor(
    private dataService: DataService,
    private jsPlumbService: JsPlumbService,
    private utilService: UtilService,
    private router: Router,
    private storageService: LocalStorageService,
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    private naviApiService: NaviApiService
  ) {
    this.data = this.dataService.data;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.router.events.subscribe((data: any) => {
      this.router.url == '/configuration/data-model/x-bpmn'
        ? (this.bpmnSubUrl = true)
        : (this.bpmnSubUrl = false);
    });
  }

  ngOnInit(): void {
    this.getMeStorageData();
  }

  getMeStorageData(): void {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.jsPlumbService.init();
    this.dataModel = undefined;
    this.dataService.loadData(this.utilService.ToModelerSchema([]));
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  ngAfterViewChecked(): void {
    if (this.dataService.flg_repaint) {
      this.dataService.flg_repaint = false;
      this.jsPlumbService.repaintEverything();
    }
  }

  getLayout(layout: any): void {
    if (layout) this.dashboard = this.layoutColumns[layout];
  }

  onChangeProduct(obj: any): void {
    localStorage.setItem('record_id', obj?.id);
    localStorage.setItem('app_name', obj.title);
    localStorage.setItem(
      'product_url',
      obj.url && obj.url !== '' ? obj.url : ''
    );
    localStorage.setItem('product', JSON.stringify(obj));
    localStorage.setItem('has_insights', obj.has_insights);
    this.utilsService.sendProductChangeBPMN(obj);
    this.getMeStorageData();
  }
}
