import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { environment } from 'src/environments/environment';
import { MenuItem } from 'primeng/api';
import { UtilsService } from '../services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service'
import { NotifyApiService } from 'src/app/api/notify.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss'],
  providers: [ConfirmationService, MessageService]
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() onChangeProduct = new EventEmitter<object>();
  @Output() loadSpinnerInParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() productId?: string | null;
  selectedOption = 'Preview';
  selectedDeviceIndex: string | null = null;
  templateEvent: any;
  showDeviceIcons: boolean = false;
  currentUser?: any;
  productOptions: MenuItem[];
  templates: any;
  url: any;
  product: any;
  iframeSrc: any;
  emailData: any;
  product_url: any;
  email: any;
  userId: any;
  showLimitReachedPopup: boolean = false;

  constructor(private apiService: ApiService, private router: Router,
    private confirmationService: ConfirmationService,
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    private notifyApi: NotifyApiService,
    private localStorageService: LocalStorageService
  ) {
    this.utilsService.getMeProductId.subscribe((event: any) => {
      if (event) {
        this.storeProductData(event)
      }
    })
    this.productOptions = [
      {
        label: 'Preview',
        command: () => {
          this.onChangeOption('Preview');
        }
      }
    ];
    this.utilsService.userHasProductEditPermission.subscribe((result) => {
      if (result) {
        this.productOptions = [
          {
            label: 'Preview',
            command: () => {
              this.onChangeOption('Preview');
            }
          },
          {
            label: 'Publish',
            command: () => {
              this.onChangeOption('Publish');
            }
          },
        ];
      }
    })
  }

  ngOnInit(): void {
    if (this.router.url === '/dashboard') {
      this.showDeviceIcons = true;
    }
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.templates = this.localStorageService.getItem(StorageKeys.MetaData);
    this.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.checkProductOptions()
  };

  storeProductData(id: string) {
    const product = this.templates?.filter((obj: any) => { return obj.id === id })[0];
    if (product) {
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('app_name', product.title);
      localStorage.setItem('product_url', product.url && product.url !== '' ? product.url : '');
      localStorage.setItem('product', JSON.stringify(product));
      this.product_url = product.product_url;
    }
  }

  openExternalLink(productUrl: string | undefined) {
    window.open(productUrl, '_blank');
  }

  deviceIconClicked(icon: string) {
    if (this.selectedDeviceIndex === icon) {
      this.selectedDeviceIndex = null;
    } else {
      this.selectedDeviceIndex = icon;
    }
    this.iconClicked.emit(icon);
  }

  onChangeOption(event: string) {
    this.selectedOption = event;
    this.onSelectOption();
  }

  onSelectOption(): void {
    let email = this.currentUser?.email == localStorage.getItem('product_email') ? this.currentUser?.email : localStorage.getItem('product_email')
    if (this.selectedOption == 'Preview') {
      window.open(environment.designStudioAppUrl + "?email=" + email + "&id=" + this.productId + '&isVerified=true' + "&has_insights=" + true, "_blank");
    } else {
      this.getMeTotalAppsPublishedCount();
    }
    this.auditUtil.postAudit(this.selectedOption, 1, 'SUCCESS', 'user-audit');
  }

  getMeTotalAppsPublishedCount(): void {
    this.apiService.get('navi/total_apps_published/' + this.currentUser?.account_id).then((res: any) => {
      if (res && res.status === 200) {
        const restriction_max_value = localStorage.getItem('restriction_max_value');
        if (restriction_max_value) {
          if (res.data.total_apps_published >= restriction_max_value) {
            this.showLimitReachedPopup = true;
            this.sendEmailNotificationToTheUser();
          } else {
            this.showConfirmationPopup();
          }
        }
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.postAudit('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data.detail, life: 3000 });
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.postAudit('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      }
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': err?.request?.responseURL
      }
      this.auditUtil.postAudit('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err, life: 3000 });
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
      "params": { "username": this.currentUser?.first_name + " " + this.currentUser?.last_name }
    }
    this.notifyApi.post('email/notify', body).then((res: any) => {
      if (res && res?.data?.detail) {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data.detail });
        let user_audit_body = {
          'method': 'POST',
          'url': res?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.postAudit('EMAIL_NOTIFY_TO_USER_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
      }
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'POST',
        'url': err?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.postAudit('EMAIL_NOTIFY_TO_USER_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  showConfirmationPopup(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to publish this product?',
      header: 'Confirmation',
      accept: () => {
        this.utilsService.loadSpinner(true)
        const body = {
          repoName: localStorage.getItem('app_name'),
          projectName: environment.projectName,
          email: this.currentUser?.email,
          envName: environment.branchName,
          productId: this.productId ? this.productId : localStorage.getItem('record_id')
        }
        this.publishProduct(body);
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  publishProduct(body: any): void {
    let detail = "Your app publishing process started. You will get the notifications";
    this.apiService.publishApp(body).then((response: any) => {
      if (response) {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.postAudit('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        this.loadSpinnerInParent.emit(false);
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: detail });
        this.utilsService.loadSpinner(false);
        this.auditUtil.postAudit("PUBLISH_APP", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.postAudit('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.auditUtil.postAudit("PUBLISH_APP", 1, 'FAILURE', 'user-audit');
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
      this.loadSpinnerInParent.emit(false);
      this.utilsService.loadSpinner(false);
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.postAudit('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.loadSpinnerInParent.emit(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      this.utilsService.loadSpinner(false)
      this.auditUtil.postAudit("PUBLISH_APP", 1, 'FAILURE', 'user-audit');

    });
  }

  checkProductOptions() {
    if (this.currentUser?.email === this.product?.email) {
      this.utilsService.userHasPermissionForProduct(true)
    } else {
      this.utilsService.userHasPermissionForProduct(false)
    }
  }


}

