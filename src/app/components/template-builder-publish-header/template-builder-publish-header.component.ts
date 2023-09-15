import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { environment } from 'src/environments/environment';
import { UserUtil } from '../../utils/user-util';
import { MenuItem } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service'
import { NotifyApiService } from 'src/app/api/notify.service';

@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss'],
  providers: [ConfirmationService, MessageService]
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() loadSpinnerInParent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() productId?: string | null;
  selectedOption = 'Preview';
  selectedDeviceIndex: string | null = null;
  templateEvent: any;
  showDeviceIcons: boolean = false;
  currentUser?: any;
  productOptions: MenuItem[];
  templates: any;
  selectedTemplate: any;
  url: any;
  productData: any;
  iframeSrc: any;
  emailData: any;
  product_url: any;
  email: any;
  showLimitReachedPopup: boolean = false;

  constructor(private apiService: ApiService, private router: Router,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    private notifyApi: NotifyApiService
  ) {
    this.currentUser = UserUtil.getCurrentUser();
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
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/dashboard') {
      this.showDeviceIcons = true;
    }
    const metaData = localStorage.getItem('meta_data');
    const product = localStorage.getItem('product');
    if (metaData) {
      this.templates = JSON.parse(metaData);
      if (product) {
        this.selectedTemplate = JSON.parse(product).id;
        this.product_url = JSON.parse(product).product_url;
      }
    }

    this.emailData = localStorage.getItem('currentUser');
    if (this.emailData) {
      let JsonData = JSON.parse(this.emailData)
      this.emailData = JsonData?.email;
    }
    if (localStorage.getItem('record_id')) {
      this.productId = this.productId ? this.productId : localStorage.getItem('record_id')
      let iframeSrc = environment.designStudioAppUrl + "?email=" + this.emailData + "&id=" + this.productId + "";
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);

    }
  };
  openExternalLink(productUrl: string | undefined) {
    window.open(productUrl, '_blank');
  }

  refreshCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      localStorage.setItem('trigger', 'graph');
      this.router.navigate([currentUrl]);
    });
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
    if (this.selectedOption == 'Preview') {
      window.open(environment.designStudioAppUrl + "?email=" + this.emailData + "&id=" + this.productId + "", "_blank");
    } else {
      this.getMeTotalAppsPublishedCount();
    }
    this.auditUtil.post(this.selectedOption, 1, 'SUCCESS', 'user-audit');
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
            this.showConfirmationPopup();
          }
        }
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data.detail, life: 3000 });
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      }
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': err?.request?.responseURL
      }
      this.auditUtil.post('TOTAL_APPS_PUBLISHED_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
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
    this.notifyApi.post(body, 'email/notify').then((res: any) => {
      if (res && res?.data?.detail) {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data.detail });
        let user_audit_body = {
          'method': 'POST',
          'url': res?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('EMAIL_NOTIFY_TO_USER_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
      }
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'POST',
        'url': err?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('EMAIL_NOTIFY_TO_USER_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
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
        this.auditUtil.post('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        this.loadSpinnerInParent.emit(false);
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: detail });
        this.utilsService.loadSpinner(false);
        this.auditUtil.post("PUBLISH_APP", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.auditUtil.post("PUBLISH_APP", 1, 'FAILURE', 'user-audit');
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.loadSpinnerInParent.emit(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      this.utilsService.loadSpinner(false)
      this.auditUtil.post("PUBLISH_APP", 1, 'FAILURE', 'user-audit');

    });
  }
  //get calls 
  getAllProducts(): void {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        if (response?.status === 200 && response.data.data?.length) {
          this.templates = response.data.data;
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_ALL_PRODUCTS_GET_METADATA_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        }
      }).catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_ALL_PRODUCTS_GET_METADATA_TEMPLATE_BUILDER_PUBLISH_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
      });
  }

  selectedProduct(data: any): void {
    const product = this.templates?.filter((obj: any) => { return obj.id === data.value })[0];
    if (product) {
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('app_name', product.title);
      localStorage.setItem('product_url', product.url && product.url !== '' ? product.url : '');
      localStorage.setItem('product', JSON.stringify(product));
      this.selectedTemplate = product.id;
      this.product_url = product.product_url;
    }
    this.utilsService.showProductStatusPopup(false);
    this.refreshCurrentRoute();
    this.auditUtil.post("TEMPLATE_HEADER_PRODUCT_DROPDOWN_CHANGE", 1, 'SUCCESS', 'user-audit');
  }
}

