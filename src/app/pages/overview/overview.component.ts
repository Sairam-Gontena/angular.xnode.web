import { Component, Input } from '@angular/core';
import *as data from '../../constants/overview.json';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service'
@Component({
  selector: 'xnode-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [MessageService]
})

export class OverViewComponent {
  @Input() currentStep: number = 2;
  loading: boolean = true;
  templates: any;
  appName = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  iconClicked: any;
  stepper: any;
  show = false;
  counter: any = 1;
  counter2: any = 1;
  jsondata: any;
  childData: any;
  currentUser?: any;
  overview: any;
  id: String = '';
  email = '';
  features: any;
  createOn: any;
  overviewData: any;
  product: any;
  product_id: any;
  username: any;
  productId: any;
  productDetails: any;

  constructor(private apiService: ApiService, private messageService: MessageService, private utils: UtilsService, private auditUtil: AuditutilsService,) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    const product = localStorage.getItem('product');
    if (product) {
      this.productDetails = JSON.parse(product);
    }
    this.productId = localStorage.getItem('record_id');
    if (this.currentUser?.email)
      this.email = this.currentUser?.email;
    let dataName = localStorage.getItem("currentUser")
    let productUserName = this.productDetails.email == this.email ? localStorage.getItem("currentUser") : this.productDetails.username;
    if (dataName) {
      if (this.productDetails.email == this.email) {
        let currentUser = JSON.parse(dataName);
        this.username = currentUser?.first_name.toUpperCase() + " " + currentUser.last_name.toUpperCase();
      } else {
        this.username = productUserName;
      }
    }
    if (product) {
      this.product = JSON.parse(product);
      this.product_id = JSON.parse(product).id;
    }
    if (this.product && !this.product?.has_insights) {
      this.utils.showProductStatusPopup(true);
      return
    }
    this.utils.loadSpinner(true)
    this.jsondata = data?.data;
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
    this.get_ID();
  };

  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
    this.iconClicked.emit(icon);
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.counter++;
  }
  prevStep(): void {
    this.stepper.prevStep();
    this.counter--;
  }
  setStep(step: any) {
    this.counter = step;
  }
  nextStep2() {
    this.stepper.nextStep();
    this.counter2++;
  }
  prevStep2() {
    this.stepper.prevStep();
    this.counter2--;
  }

  setStep2(step: any) {
    this.counter2 = step;
  }

  get_ID() {
    let productEmail = this.productDetails.email == this.email ? this.email : this.productDetails.email
    this.apiService.get('navi/get_metadata/' + productEmail)
      .then(response => {
        if (response?.status === 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_ID_GET_METADATA_OVERVIEW', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
          this.id = response.data.data[0].id;
          this.getMeOverview();
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_ID_GET_METADATA_OVERVIEW', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
          this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
          this.utils.loadSpinner(false);
        }
      }).catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_ID_GET_METADATA_OVERVIEW', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: '', detail: error });
      });
  }

  getMeProductId() {
    return !localStorage.getItem('record_id') ? this.id : localStorage.getItem('record_id');
  }
  getMeOverview() {
    let productEmail = this.productDetails.email == this.email ? this.email : this.productDetails.email
    this.apiService.get("navi/get_overview/" + productEmail + "/" + this.getMeProductId())
      .then((response: any) => {
        if (response?.status === 200) {
          this.overview = response.data;
          this.features = response.data?.Features;
          this.appName = response?.data?.Title ? response?.data?.Title : response?.data?.title;
          this.createOn = response?.data?.created_on;
          localStorage.setItem("app_name", response?.data?.Title ? response?.data?.Title : response?.data?.title);
          this.auditUtil.post("RETRIEVE_OVERVIEW", 1, 'SUCCESS', 'user-audit');
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_ME_OVERVIEW_RETRIEVE_OVERVIEW', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_ME_OVERVIEW_RETRIEVE_OVERVIEW', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
          this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
          this.auditUtil.post("RETRIEVE_OVERVIEW" + response?.data?.detail, 1, 'FAILURE', 'user-audit');
        }
        this.utils.loadSpinner(false);
      }).catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_ME_OVERVIEW_RETRIEVE_OVERVIEW', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utils.loadSpinner(false);
        this.auditUtil.post("RETRIEVE_OVERVIEW" + error, 1, 'FAILURE', 'user-audit');
      });
  }
}

