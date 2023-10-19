import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-spec-gen-popup',
  templateUrl: './spec-gen-popup.component.html',
  styleUrls: ['./spec-gen-popup.component.scss']
})
export class SpecGenPopupComponent implements OnInit {
  @Input() content: any;
  @Input() showSpecGenaretePopup: any;
  @Output() closePopup = new EventEmitter<boolean>();
  email: any;
  userId: any;
  product: any;
  consversationList: any;
  constructor(private utils: UtilsService,
    private apiService: ApiService,
    private auditUtil: AuditutilsService,) {
  }

  ngOnInit(): void {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
      this.userId = JSON.parse(currentUser).user_id;
    }
    let product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
    }
  }

  generate(): void {
    this.getPreviousCoversation();
  }

  getPreviousCoversation(): void {
    this.utils.loadSpinner(true);
    this.apiService.get('/get_conversation/' + this.product.email + '/' + this.product.id).then((res: any) => {
      if (res.status === 200 && res.data) {
        this.consversationList = res.data?.conversation_history;
        this.generateSpec();
      } else {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: 'Network Error' });
      }
    }).catch((err: any) => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
    })
  }

  generateSpec() {
    const body = {
      email: this?.product.email,
      conversation_history: this.consversationList,
      product_id: this.product.id
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
        this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product.id);
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: detail });
        this.auditUtil.post("GENERATE_SPEC", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product.id);
        this.auditUtil.post("GENERATE_SPEC", 1, 'FAILURE', 'user-audit');
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product.id);
      this.utils.loadSpinner(false)
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      this.auditUtil.post("GENERATE_SPEC", 1, 'FAILURE', 'user-audit');
    });
  }
}
