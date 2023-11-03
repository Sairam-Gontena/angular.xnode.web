import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Data } from './class/data';
import { Router } from '@angular/router';
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';
import { UtilService } from './service/util.service';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
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
  selectedTemplate = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  isOpen = true;
  id: String = '';
  currentUser?: User;
  dataModel: any;
  product: any;
  product_id: any;
  @Input() erModelInput: any;
  productDetails: any

  constructor(private apiService: ApiService,
    private dataService: DataService, private jsPlumbService: JsPlumbService,
    private utilService: UtilService, private router: Router,
    private utilsService: UtilsService, private auditUtil: AuditutilsService) {
    this.data = this.dataService.data;
    this.currentUser = UserUtil.getCurrentUser();
    this.router.events.subscribe((data: any) => {
      this.router.url == "/configuration/data-model/x-bpmn" ? this.bpmnSubUrl = true : this.bpmnSubUrl = false;
    });
  }

  ngOnInit(): void {
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
      this.productDetails = JSON.parse(product);
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
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }


  //get calls 
  getMeUserId() {
    let productEmail = this.productDetails.email == this.currentUser?.email ? this.currentUser?.email : this.productDetails.email

    this.apiService.get("navi/get_metadata/" + productEmail)
      .then(response => {
        if (response?.status === 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_USERID_GET_METADATA_ER_MODELLER', 1, 'SUCCESS', 'user-audit', user_audit_body, productEmail, this.product_id);
          this.id = response.data.data[0].id;
          localStorage.setItem('record_id', response.data.data[0].id)
          this.getMeDataModel();
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_USERID_GET_METADATA_ER_MODELLER', 1, 'FAILED', 'user-audit', user_audit_body, productEmail, this.product_id);
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
        }
        this.utilsService.loadSpinner(false);
      }).catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_USERID_GET_METADATA_ER_MODELLER', 1, 'FAILED', 'user-audit', user_audit_body, productEmail, this.product_id);
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilsService.loadSpinner(false)
      });
  }

  getMeDataModel() {
    let productEmail = this.productDetails.email == this.currentUser?.email ? this.currentUser?.email : this.productDetails.email
    this.dataModel = null;
    this.apiService.get("navi/get_insights/" + productEmail + "/" + this.product_id)
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
