import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { PublishAppApiService } from 'src/app/api/publish-app-api.service';
import { UtilsService } from '../services/utils.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { environment } from 'src/environments/environment';
import { NotifyApiService } from 'src/app/api/notify.service';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { SpecApiService } from 'src/app/api/spec-api.service';
@Component({
  selector: 'xnode-product-alert-popup',
  templateUrl: './product-alert-popup.component.html',
  styleUrls: ['./product-alert-popup.component.scss'],
})
export class ProductAlertPopupComponent implements OnInit {
  @Input() showProductStatusPopup: any;
  @Output() closePopup = new EventEmitter<boolean>();
  @Output() openDockedNavi = new EventEmitter<Object>();
  @Input() contentdata: any;

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
  conversation_id: any;

  constructor(
    private publishAppApiService: PublishAppApiService,
    private naviApiService: NaviApiService,
    private utils: UtilsService,
    private auditUtil: AuditutilsService,
    private notifyApi: NotifyApiService,
    private specApiService: SpecApiService
  ) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.product = localStorage.getItem('product');
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
      this.userId = JSON.parse(currentUser).user_id;
    }
    if (this.contentdata || this.contentdata != 'undefined') {
      this.dataPopulate();
    } else {
      this.product_id = localStorage.getItem('record_id');
      this.showProductStatusPopup = true;
    }
    this.utils.getMeproductAlertPopup.subscribe((event: any) => {
      setTimeout(() => {
        this.contentdata = event?.data;
        this.conversation_id = event?.data?.conversation_id
        this.dataPopulate();
        if (event.data.length || event.popup == true) {
          this.showProductStatusPopup = event?.popup;
        }
      });
    });
  }

  dataPopulate() {
    if (this.contentdata || this.contentdata != 'undefined') {
      if (this.contentdata?.content)
        this.dialogHeader = 'Confirm ' + this.contentdata?.content;
      switch (this.contentdata?.content) {
        case 'App Generation': {
          this.buttonLabel = 'Generate app';
          this.content = 'generate';
          break;
        }
        case 'App Publishing': {
          this.buttonLabel = 'Publish app';
          this.content = 'publish';
          break;
        }
        case 'Spec Generation': {
          this.buttonLabel = 'Generate Spec';
          this.content = 'generate spec for';
          break;
        }
        default: {
          this.buttonLabel = 'Cancel';
          this.content = 'App not created yet';
          break;
        }
      }
      this.product_id = this.contentdata?.product_id;
      if (typeof(this.contentdata?.conversation)=='string'){
        this.consversationList = JSON.parse(this.contentdata?.conversation);
      }else{
        this.consversationList = this.contentdata?.conversation
      }
    }
  }

  continueChat(): void {
    this.closePopup.emit(true);
  }

  actionButton() {
    switch (this.buttonLabel) {
      case 'Generate app': {
        this.persistConversaiton();
        this.utils.loadSpinner(true);
        break;
      }
      case 'Publish app': {
        this.getProduct();
        this.utils.loadSpinner(true);
        break;
      }
      case 'Generate Spec': {
        this.generateSpec();
        this.utils.loadSpinner(true);
        break;
      }
      case 'Generate Application': {
        this.getPreviousCoversation();
        break;
      }
      case 'Cancel': {
        this.closePopup.emit(true);
        break;
      }
    }
  }

  getProduct(): void {
    this.naviApiService
      .getEntireData(this.currentUser?.email, this.product_id)
      .then((res: any) => {
        if (res) {
          this.proTitle = res?.data?.conversation_details?.title;
          this.getMeTotalAppsPublishedCount();
          this.closePopup.emit(true);
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'PRODUCT_ALERT_POPUP_PUBLISH_PRODUCT',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.utils.loadSpinner(false);
          this.auditUtil.postAudit(
            'PRODUCT_ALERT_POPUP_PUBLISH_PRODUCT',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'An error occurred while publishing the product.',
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        let user_audit_body = {
          method: 'GET',
          url: err?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'PRODUCT_ALERT_POPUP_PUBLISH_PRODUCT',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.product_id
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: 'An error occurred while publishing the product.',
        });
      });
  }

  publishProduct() {
    const body = {
      repoName: this.proTitle,
      projectName: environment.projectName,
      email: this.currentUser?.email,
      envName: environment.branchName,
      productId: this.product_id,
    };
    let detail =
      'Your app publishing process started. You will get the notifications';
    this.publishAppApiService
      .publishApp(body)
      .then((response: any) => {
        if (response) {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'PUBLISH_APP_PRODUCT_ALERT_POPUP',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: detail,
          });
          this.auditUtil.postAudit('PUBLISH_APP', 1, 'SUCCESS', 'user-audit');
        } else {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'PUBLISH_APP_PRODUCT_ALERT_POPUP',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
          this.auditUtil.postAudit('PUBLISH_APP', 1, 'FAILURE', 'user-audit');
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'An error occurred while publishing the product.',
          });
        }
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'POST',
          url: error?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'PUBLISH_APP_PRODUCT_ALERT_POPUP',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.product_id
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.auditUtil.postAudit('PUBLISH_APP', 1, 'FAILURE', 'user-audit');
      });
  }

  generateSpec() {
    const body = {
      email: this.currentUser?.email,
      conversation_history: this.consversationList,
      conversation_id:this.conversation_id,
      product_id: this.product_id,
      user_id: this.currentUser?.user_id,
    };
    let detail = 'Generating spec for this app process is started.';
    this.closePopup.emit(true);
    this.naviApiService
      .generateSpec(body)
      .then((response: any) => {
        if (response) {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'GENERATE_SPEC_PRODUCT_ALERT_POPUP',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: detail,
          });
          this.auditUtil.postAudit('GENERATE_SPEC', 1, 'SUCCESS', 'user-audit');
        } else {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'GENERATE_SPEC_PRODUCT_ALERT_POPUP',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
          this.auditUtil.postAudit('GENERATE_SPEC', 1, 'FAILURE', 'user-audit');
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'An error occurred while publishing the product.',
          });
        }
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'POST',
          url: error?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'GENERATE_SPEC_PRODUCT_ALERT_POPUP',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.product_id
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.auditUtil.postAudit('GENERATE_SPEC', 1, 'FAILURE', 'user-audit');
      });
  }

  getPreviousCoversation(): void {
    this.utils.loadSpinner(true);
    this.naviApiService
      .getConversation(this.currentUser?.email, this.product_id)
      .then((res: any) => {
        if (res.status === 200 && res.data) {
          this.consversationList = res.data?.conversation_history;
          this.persistConversaiton();
          this.auditUtil.postAudit(
            'GENERATE_APP_FROM_PRODUCT_POPUP',
            1,
            'SUCCESS',
            'user-audit'
          );
        } else {
          this.utils.loadSpinner(false);
          this.auditUtil.postAudit(
            'GENERATE_APP_FROM_PRODUCT_POPUP',
            1,
            'FAILURE',
            'user-audit'
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: 'Network Error',
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
        this.auditUtil.postAudit(
          'GENERATE_APP_FROM_PRODUCT_POPUP',
          1,
          'FAILURE',
          'user-audit'
        );
      });
  }

  persistConversaiton() {
    const persistconversation = {
      email: this.currentUser?.email,
      conversation_history: this.consversationList,
      product_id: this.product_id,
    };
    this.naviApiService
      .persistConversation(persistconversation)
      .then((response: any) => {
        if (response) {
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail:
              'Started generating application, please look out for notifications in the top nav bar',
          });
          if (this.buttonLabel == 'Generate app') {
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
          this.closePopup.emit(true);
        } else {
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: response.data?.detail,
          });
        }
      })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      });
  }

  getMeTotalAppsPublishedCount(): void {
    this.naviApiService
      .getTotalPublishedApps(this.currentUser?.account_id)
      .then((res: any) => {
        if (res && res.status === 200) {
          const restriction_max_value = localStorage.getItem(
            'restriction_max_value'
          );
          if (restriction_max_value) {
            if (res.data.total_apps_published >= restriction_max_value) {
              this.showLimitReachedPopup = true;
              this.sendEmailNotificationToTheUser();
            } else {
              this.publishProduct();
            }
          }
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
        } else {
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data.detail,
            life: 3000,
          });
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
        }
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'GET',
          url: err?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.product_id
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
          life: 3000,
        });
      });
  }

  sendEmailNotificationToTheUser(): void {
    const body = {
      to: [this.currentUser?.email],
      cc: ['beta@xnode.ai'],
      bcc: ['dev.xnode@salientminds.com'],
      emailTemplateCode: 'PUBLISH_APP_LIMIT_EXCEEDED',
      params: {
        username:
          this.currentUser?.firstName + ' ' + this.currentUser?.lastName,
      },
    };
    this.notifyApi
      .emailNotify(body)
      .then((res: any) => {
        if (res && res?.data?.detail) {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data.detail,
          });
          let user_audit_body = {
            method: 'POST',
            url: res?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'EMAIL_NOTIFY_TO_USER_TEMPLATE_BUILDER_PUBLISH_HEADER',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.product_id
          );
          this.utils.loadSpinner(false);
        }
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'POST',
          url: err?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'EMAIL_NOTIFY_TO_USER_TEMPLATE_BUILDER_PUBLISH_HEADER',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.product_id
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }
}
