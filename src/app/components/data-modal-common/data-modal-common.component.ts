import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { DataService } from 'src/app/pages/er-modeller/service/data.service';
import { JsPlumbService } from 'src/app/pages/er-modeller/service/jsPlumb.service';
import { UtilService } from 'src/app/pages/er-modeller/service/util.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'xnode-data-modal-common',
  templateUrl: './data-modal-common.component.html',
  styleUrls: ['./data-modal-common.component.scss']
})
export class DataModalCommonComponent implements AfterViewChecked, OnInit {
  data: Data | any;
  bpmnSubUrl: boolean = false;
  dashboard: any;
  layoutColumns: any;
  loading: boolean = true;
  selectedTemplate = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  isOpen = true;
  id: String = '';
  currentUser?: User;
  dataModel: any;
  product: any;
  product_id: any;
  @Input() erModelInput: any;

  constructor(private apiService: ApiService,
    private dataService: DataService, private jsPlumbService: JsPlumbService,
    private utilService: UtilService, private router: Router,
    private utilsService: UtilsService, private auditUtil: AuditutilsService) {
    this.data = this.dataService.data;
    this.currentUser = UserUtil.getCurrentUser();

  }

  ngOnInit(): void {
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
      this.product_id = JSON.parse(product).id;
      if (!this.product?.has_insights) {
        this.utilsService.showProductStatusPopup(true);
        return
      }
    } else {
      let pro_id = localStorage.getItem('record_id');
      this.product_id = pro_id;
    }
    this.utilsService.loadSpinner(true);
    this.getMeDataModel();
  }
  ngAfterViewChecked(): void {
    if (this.dataService.flg_repaint) {
      this.dataService.flg_repaint = false;
      this.jsPlumbService.repaintEverything();
    }
  }
  //get calls 
  getMeUserId() {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        if (response?.status === 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_USERID_GET_METADATA_ER_MODELLER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.currentUser?.email, this.product_id);
          this.id = response.data.data[0].id;
          localStorage.setItem('record_id', response.data.data[0].id)
          this.getMeDataModel();
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_USERID_GET_METADATA_ER_MODELLER', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser?.email, this.product_id);
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
        }
        this.utilsService.loadSpinner(false);
      }).catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_USERID_GET_METADATA_ER_MODELLER', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser?.email, this.product_id);
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilsService.loadSpinner(false)
      });
  }

  getMeDataModel() {
    this.dataModel = null;
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + this.product_id)
      .then(response => {
        if (response?.status === 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_DATA_MODEL_RETRIEVE_INSIGHTS_ER_MODELLER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.currentUser?.email, this.product_id);
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.dataModel = Array.isArray(data.data_model) ? data.data_model[0] : data.data_model;
          this.jsPlumbService.init();
          this.dataService.loadData(this.utilService.ToModelerSchema(this.dataModel));
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_DATA_MODEL_RETRIEVE_INSIGHTS_ER_MODELLER', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser?.email, this.product_id);
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
          this.utilsService.showProductStatusPopup(true);
        }
        this.utilsService.loadSpinner(false);
      })
      .catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_DATA_MODEL_RETRIEVE_INSIGHTS_ER_MODELLER', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser?.email, this.product_id);
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilsService.loadSpinner(false);
      });
  }
}
