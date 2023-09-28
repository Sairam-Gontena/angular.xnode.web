import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from '../services/utils.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { environment } from 'src/environments/environment';

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
  dialogHeader: string = 'Product Status';
  buttonLabel: string = '';
  product_id: any;
  email: any;
  userId: any;
  proTitle: any;

  constructor(private apiService: ApiService, private utils: UtilsService, private auditUtil: AuditutilsService,) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
      this.userId = JSON.parse(currentUser).user_id;
    }
    if (this.data.content) {
      this.dialogHeader = 'Confirm ' + this.data.content
      switch (this.data.content) {
        case "App Generation": {
          this.buttonLabel = 'Generate app';
          break;
        }
        case "App Publishing": {
          this.buttonLabel = 'Publish app';
          break;
        }
        case "Spec Generation": {
          this.buttonLabel = 'Generate Spec'
          break;
        }
        default: {
          this.buttonLabel = 'Generate Application';
          break;
        }
      }
      this.product_id = this.data?.product_id;
      this.consversationList = JSON.parse(this.data.conversation);
    } else {
      this.product_id = localStorage.getItem('record_id');
    }
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
        console.log('spec generation clicked TBD')
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
        this.publishProduct();
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
        this.auditUtil.post('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product_id);
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: detail });
        this.utils.loadSpinner(false);
        this.auditUtil.post("PUBLISH_APP", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
        this.auditUtil.post("PUBLISH_APP", 1, 'FAILURE', 'user-audit');
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      this.utils.loadSpinner(false)
      this.auditUtil.post("PUBLISH_APP", 1, 'FAILURE', 'user-audit');
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
        this.closePopup.emit(true);
      } else
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data?.detail });
    }).catch((err: any) => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
    })
  }
}
