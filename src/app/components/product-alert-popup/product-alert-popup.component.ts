import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from '../services/utils.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { environment } from 'src/environments/environment';
import { NotifyApiService } from 'src/app/api/notify.service';
@Component({
  selector: 'xnode-product-alert-popup',
  templateUrl: './product-alert-popup.component.html',
  styleUrls: ['./product-alert-popup.component.scss']
})
export class ProductAlertPopupComponent implements OnInit {
  @Input() showProductStatusPopup: any;
  @Output() closePopup = new EventEmitter<boolean>();
  @Output() openDockedNavi = new EventEmitter<Object>();
  @Input() data: any;

  visible = true;
  consversationList = [];
  currentUser?: User;
  dialogHeader: string = 'Confirm App Generation';
  buttonLabel: string = 'Generate app';
  product_id: any;
  email: any;
  userId: any;
  content: any;
  proTitle: any;
  product: any;
  xnodeAppUrl: string = environment.xnodeAppUrl;
  showLimitReachedPopup: boolean = false;

  constructor(private apiService: ApiService, private utils: UtilsService, private auditUtil: AuditutilsService,
    private notifyApi: NotifyApiService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.utils.getMeproductAlertPopup.subscribe((event: any) => {
      setTimeout(() => {
        this.data = this.data;
        this.dataPopulate();
      },);
      this.showProductStatusPopup = event;
    });
    this.product = localStorage.getItem('product');
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
      this.userId = JSON.parse(currentUser).user_id;
    }
    if (this.data) {
      this.dataPopulate();
    } else {
      this.product_id = localStorage.getItem('record_id');
    }
  }

  dataPopulate() {
    this.dialogHeader = 'Confirm ' + this.data?.content
    switch (this.data?.content) {
      case "App Generation": {
        this.buttonLabel = 'Generate app';
        this.content = 'generate';
        break;
      }
      case "App Publishing": {
        this.buttonLabel = 'Publish app';
        this.content = 'publish';
        break;
      }
      case "Spec Generation": {
        this.buttonLabel = 'Generate Spec'
        this.content = 'generate spec for';
        break;
      }
      default: {
        this.buttonLabel = 'Generate app';
        break;
      }
    }
    this.product_id = this.data?.product_id;
    this.consversationList = JSON.parse(this.data?.conversation);
  }

  continueChat(): void {
    this.closePopup.emit(true);
  }

  actionButton() {
    switch (this.buttonLabel) {
      case "Generate app": {
        this.persistConversaiton();
        break;
      }
      case "Publish app": {
        this.getProduct();
        break;
      }
      case "Generate Spec": {
        this.generateSpec();
        break;
      }
      case "Generate Application": {
        this.getPreviousCoversation();
        break;
      }
    }
  }

  getProduct(): void {
    this.apiService.get('/get_entire_data/' + this.currentUser?.email + '/' + this.product_id).then((res: any) => {
      if (res) {
        this.proTitle = res?.data?.conversation_details?.title;
        this.getMeTotalAppsPublishedCount();
        this.closePopup.emit(true);
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('PRODUCT_ALERT_POPUP_PUBLISH_PRODUCT', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product_id);
      } else {
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('PRODUCT_ALERT_POPUP_PUBLISH_PRODUCT', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
    }).catch((err: any) => {
      console.log(err)
      let user_audit_body = {
        'method': 'GET',
        'url': err?.request?.responseURL
      }
      this.auditUtil.post('PRODUCT_ALERT_POPUP_PUBLISH_PRODUCT', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
    })
  }

  publishProduct() {
    const body = {
      repoName: this.proTitle,
      projectName: environment.projectName,
      email: this.currentUser?.email,
      envName: environment.branchName,
      productId: this.product_id
    }
    let detail = "Your app publishing process started. You will get the notifications";
    this.apiService.publishApp(body).then((response: any) => {
      if (response) {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('PUBLISH_APP_PRODUCT_ALERT_POPUP', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product_id);
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: detail });
        this.utils.loadSpinner(false);
        this.auditUtil.post("PUBLISH_APP", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('PUBLISH_APP_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
        this.auditUtil.post("PUBLISH_APP", 1, 'FAILURE', 'user-audit');
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('PUBLISH_APP_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      this.utils.loadSpinner(false)
      this.auditUtil.post("PUBLISH_APP", 1, 'FAILURE', 'user-audit');
    });
  }

  generateSpec() {
    const body = {
      email: this.currentUser?.email,
      conversation_history: this.consversationList,
      product_id: this.product_id
    }
    let detail = "Generating spec for this app process is started.";
    this.closePopup.emit(true);
    this.apiService.postApi(body, 'specs/generate').then((response: any) => {
      if (response) {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product_id);
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: detail });
        this.utils.loadSpinner(false);
        this.auditUtil.post("GENERATE_SPEC", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
        this.auditUtil.post("GENERATE_SPEC", 1, 'FAILURE', 'user-audit');
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      this.utils.loadSpinner(false)
      this.auditUtil.post("GENERATE_SPEC", 1, 'FAILURE', 'user-audit');
    });
  }

  getPreviousCoversation(): void {
    this.utils.loadSpinner(true);
    this.apiService.get('/get_conversation/' + this.currentUser?.email + '/' + this.product_id).then((res: any) => {
      if (res.status === 200 && res.data) {
        this.consversationList = res.data?.conversation_history;
        this.persistConversaiton();
        this.auditUtil.post('GENERATE_APP_FROM_PRODUCT_POPUP', 1, 'SUCCESS', 'user-audit');
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: 'Network Error' });
        this.auditUtil.post('GENERATE_APP_FROM_PRODUCT_POPUP', 1, 'FAILURE', 'user-audit');
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.auditUtil.post('GENERATE_APP_FROM_PRODUCT_POPUP', 1, 'FAILURE', 'user-audit');

    })
  }

  persistConversaiton() {
    const persistconversation = {
      "email": this.currentUser?.email,
      "conversation_history": this.consversationList,
      "product_id": this.product_id
    }
    this.apiService.post(persistconversation, '/persist_conversation').then((response: any) => {
      if (response) {
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "Started generating application, please look out for notifications in the top nav bar" });
        if (this.buttonLabel == 'Generate app') {
          const customEvent = new Event('customEvent');
          window.dispatchEvent(customEvent);
        }
        this.closePopup.emit(true);
      } else
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data?.detail });
    }).catch((err: any) => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
    })
  }

  getMeTotalAppsPublishedCount(): void {
    this.apiService.get('/total_apps_published/' + this.currentUser?.account_id).then((res: any) => {
      if (res && res.status === 200) {
        const restriction_max_value = localStorage.getItem('restriction_max_value');
        if (restriction_max_value) {
          if (res.data.total_apps_published >= restriction_max_value) {
            this.showLimitReachedPopup = true;
            this.sendEmailNotificationToTheUser();
          } else {
            this.publishProduct();
          }
        }
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product_id);
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data.detail, life: 3000 });
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
      }
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': err?.request?.responseURL
      }
      this.auditUtil.post('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err, life: 3000 });
    })
  }

  sendEmailNotificationToTheUser(): void {
    const body = {
      "to": [
        this.currentUser?.email
      ],
      "cc": [
        "beta@xnode.ai"
      ],
      "bcc": [
        "dev.xnode@salientminds.com"
      ],
      "emailTemplateCode": "PUBLISH_APP_LIMIT_EXCEEDED",
      "params": { "username": this.currentUser?.firstName + " " + this.currentUser?.lastName }
    }
    this.notifyApi.post(body, 'email/notify').then((res: any) => {
      if (res && res?.data?.detail) {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data.detail });
        let user_audit_body = {
          'method': 'POST',
          'url': res?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('EMAIL_NOTIFY_TO_USER_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product_id);
      }
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'POST',
        'url': err?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('EMAIL_NOTIFY_TO_USER_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }
}
