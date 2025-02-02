import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Data } from '../../pages/er-modeller/class/data';
import { Router } from '@angular/router';
import { DataService } from '../../pages/er-modeller/service/data.service';
import { JsPlumbService } from '../../pages/er-modeller/service/jsPlumb.service';
import { UtilService } from '../../pages/er-modeller/service/util.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { Subscription } from 'rxjs';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { SpecApiService } from 'src/app/api/spec-api.service';

@Component({
  selector: 'xnode-data-model-common',
  templateUrl: './data-model-common.component.html',
  styleUrls: ['./data-model-common.component.scss'],
  providers: [DataService, JsPlumbService, UtilService, MessageService],
})
export class DataModelCommonComponent {
  @Input() erModelInput: any;
  @Input() dataToExpand: any;
  @Input() specExpanded?: boolean;
  @Input() specData: string = '';
  @Input() inExpandSpec: any;
  @Input() inDiffView: any;
  @Output() dataFlowEmitter = new EventEmitter<any>();
  data: Data | any;
  bpmnSubUrl: boolean = false;
  dashboard: any;
  layoutColumns: any;
  loading: boolean = true;
  highlightedIndex: string | null = null;
  isOpen = true;
  currentUser?: any;
  dataModel: any = [];
  product: any;
  currentUrl: string = '';
  productChanged = false;
  private productChangedBPMN: Subscription = new Subscription();
  @ViewChild('canvaDataModel', { static: false })
  canvaDataModel!: ElementRef;

  constructor(
    private dataService: DataService,
    private jsPlumbService: JsPlumbService,
    private utilService: UtilService,
    private router: Router,
    private storageService: LocalStorageService,
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    private changeDetectorRef: ChangeDetectorRef,
    private naviApiService: NaviApiService,
    private specApiService: SpecApiService
  ) {
    this.router.events.subscribe((data: any) => {
      this.router.url == '/configuration/data-model/x-bpmn'
        ? (this.bpmnSubUrl = true)
        : (this.bpmnSubUrl = false);
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.utilsService.getProductChangeBPMN().subscribe((data: any) => {
      if (data) {
        this.product = data;
        this.getDataModel();
      }
    });
    setTimeout(() => {
      if (this.specData === 'spec') {
        const list: any = this.storageService.getItem(StorageKeys.SPEC_DATA);
        list[3].content.forEach((item: any) => {
          if (item.title == 'Data Model') {
            this.dataModel = item.content;
          }
        });
        this.jsPlumbService.init();
        this.dataService.loadData(
          this.utilService.ToModelerSchema(this.dataModel)
        );
      } else {
        this.getDataModel();
      }
    }, 100);
    this.data = this.dataService.data;
  }

  getDataModel() {
    this.dataModel = [];
    this.specApiService
      .getDataModel(this.product.id)
      .then((response) => {
        if (response?.status === 200) {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_DATA_MODEL_RETRIEVE_INSIGHTS_ER_MODELLER',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser?.email,
            this.product?.id
          );
          this.dataModel = response.data;
          if (this.inDiffView) {
            let diffObj = { inDiffView: true, ids: [this.canvaDataModel.nativeElement] }
            this.jsPlumbService.init(diffObj);
          } else {
            this.jsPlumbService.init();
          }
          this.dataService.loadData(
            this.utilService.ToModelerSchema(this.dataModel)
          );
          this.jsPlumbService.repaintEverything();
        } else {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_DATA_MODEL_RETRIEVE_INSIGHTS_ER_MODELLER',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser?.email,
            this.product?.id
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.detail,
          });
          this.utilsService.showProductStatusPopup(true);
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_DATA_MODEL_RETRIEVE_INSIGHTS_ER_MODELLER',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser?.email,
          this.product?.id
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.utilsService.loadSpinner(false);
      });
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

  expandDataFlows(): void {
    this.dataFlowEmitter.emit(this.dataToExpand);
  }
}
