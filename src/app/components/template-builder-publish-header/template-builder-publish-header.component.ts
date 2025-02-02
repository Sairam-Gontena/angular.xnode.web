import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PublishAppApiService } from 'src/app/api/publish-app-api.service';
import { environment } from 'src/environments/environment';
import { MenuItem } from 'primeng/api';
import { UtilsService } from '../services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { NotifyApiService } from 'src/app/api/notify.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';

@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class TemplateBuilderPublishHeaderComponent implements OnInit {
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() onChangeProduct = new EventEmitter<object>();
  @Output() loadSpinnerInParent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  selectedOption = 'Preview';
  selectedDeviceIndex: string | null = null;
  templateEvent: any;
  showDeviceIcons: boolean = false;
  currentUser?: any;
  productOptions: MenuItem[];
  templates: any;
  productId: any;
  url: any;
  product: any;
  showLimitReachedPopup: boolean = false;

  constructor(
    private publishAppApiService: PublishAppApiService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    private notifyApi: NotifyApiService,
    private localStorageService: LocalStorageService,
    private naviApiService: NaviApiService,
    private conversationService: ConversationHubService
  ) {
    this.utilsService.getMeProductId.subscribe((event: any) => {
      if (event) {
        this.productId = event;
        this.storeProductData(event);
      }
    });
    this.productOptions = [
      {
        label: 'Preview',
        command: () => {
          this.onChangeOption('Preview');
        },
      },
    ];
    this.utilsService.hasProductEditPermission.subscribe((result) => {
      if (result) {
        this.productOptions = [
          {
            label: 'Preview',
            command: () => {
              this.onChangeOption('Preview');
            },
          },
          // {
          //   label: 'Publish',
          //   command: () => {
          //     this.onChangeOption('Publish');
          //   },
          // },
        ];
      }
    });
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/dashboard') {
      this.showDeviceIcons = true;
    }
    this.currentUser = this.localStorageService.getItem(
      StorageKeys.CurrentUser
    );
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.templates = this.localStorageService.getItem(StorageKeys.MetaData);
    this.productId = this.productId
      ? this.productId
      : localStorage.getItem('record_id');
    this.checkProductOptions();
    this.utilsService.getMeProductId.subscribe((data) => {
      if (data) {
        this.product = this.localStorageService.getItem(StorageKeys.Product);
      }
    })
  }

  changeTheProduct(obj: any): void {
    this.product = obj;
    localStorage.setItem('record_id', obj?.id);
    localStorage.setItem('app_name', obj.title);
    localStorage.setItem(
      'product_url',
      obj.url && obj.url !== '' ? obj.url : ''
    );
    localStorage.setItem('product', JSON.stringify(obj));
    this.utilsService.saveProductDetails(obj);
    this.onChangeProduct.emit(obj);
  }

  storeProductData(id: string) {
    const product = this.templates?.filter((obj: any) => {
      return obj.id === id;
    })[0];
    if (product) {
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('app_name', product.title);
      localStorage.setItem(
        'product_url',
        product.url && product.url !== '' ? product.url : ''
      );
      localStorage.setItem('product', JSON.stringify(product));
    }
  }

  openExternalLink(productUrl: string | undefined) {
    productUrl += '&openExternal=true';
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
    if (this.selectedOption == 'Preview') {
      const token = this.localStorageService.getItem(StorageKeys.ACCESS_TOKEN);
      let url =
        environment.designStudioAppUrl +
        '?email=' +
        this.product.email +
        '&id=' +
        this.product.id +
        '&isVerified=true' +
        '&has_insights=' +
        true;
      if (token) {
        url = url + '&token=' + token;
      }
      window.open(url, '_blank');
    } else {
      this.getMeTotalAppsPublishedCount();
    }
    this.auditUtil.postAudit(this.selectedOption, 1, 'SUCCESS', 'user-audit');
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
              this.showConfirmationPopup();
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
            this.currentUser.email,
            this.productId
          );
        } else {
          this.utilsService.loadToaster({
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
            this.currentUser.email,
            this.productId
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
          this.currentUser.email,
          this.productId
        );
        this.utilsService.loadToaster({
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
          this.currentUser?.first_name + ' ' + this.currentUser?.last_name,
      },
    };
    this.notifyApi
      .emailNotify(body)
      .then((res: any) => {
        if (res && res?.data?.detail) {
          this.utilsService.loadToaster({
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
            this.currentUser.email,
            this.productId
          );
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
          this.currentUser.email,
          this.productId
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  showConfirmationPopup(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to publish this product?',
      header: 'Confirmation',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'custom-accept-button',
      rejectButtonStyleClass: 'custom-reject-button',
      accept: () => {
        this.utilsService.loadSpinner(true);
        const body = {
          repoName: localStorage.getItem('app_name'),
          projectName: environment.projectName,
          email: this.currentUser?.email,
          envName: environment.branchName,
          productId: this.productId
            ? this.productId
            : localStorage.getItem('record_id'),
        };
        this.publishProduct(body);
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  publishProduct(body: any): void {
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
            'PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.productId
          );
          this.loadSpinnerInParent.emit(false);
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: detail,
          });
          this.utilsService.loadSpinner(false);
          this.auditUtil.postAudit('PUBLISH_APP', 1, 'SUCCESS', 'user-audit');
        } else {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.productId
          );
          this.auditUtil.postAudit('PUBLISH_APP', 1, 'FAILURE', 'user-audit');
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'An error occurred while publishing the product.',
          });
        }
        this.loadSpinnerInParent.emit(false);
        this.utilsService.loadSpinner(false);
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'POST',
          url: error?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'PUBLISH_APP_TEMPLATE_BUILDER_PUBLISH_HEADER',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.productId
        );
        this.loadSpinnerInParent.emit(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.utilsService.loadSpinner(false);
        this.auditUtil.postAudit('PUBLISH_APP', 1, 'FAILURE', 'user-audit');
      });
  }
  //get calls
  getAllProducts(): void {
    this.conversationService.getMetaData({ accountId: this.currentUser.account_id }).then((response) => {
      if (response?.status === 200 && response.data?.length) {
        this.templates = response.data;
        let user_audit_body = {
          method: 'GET',
          url: response?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_ALL_PRODUCTS_GET_METADATA_TEMPLATE_BUILDER_PUBLISH_HEADER',
          1,
          'SUCCESS',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.productId
        );
      }
    })
      .catch((error) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_ALL_PRODUCTS_GET_METADATA_TEMPLATE_BUILDER_PUBLISH_HEADER',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.productId
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: '',
          detail: error,
        });
      });
    // this.naviApiService
    //   .getMetaData(this.currentUser?.email)
    //   .then((response) => {
    //     if (response?.status === 200 && response.data.data?.length) {
    //       this.templates = response.data.data;
    //       let user_audit_body = {
    //         method: 'GET',
    //         url: response?.request?.responseURL,
    //       };
    //       this.auditUtil.postAudit(
    //         'GET_ALL_PRODUCTS_GET_METADATA_TEMPLATE_BUILDER_PUBLISH_HEADER',
    //         1,
    //         'SUCCESS',
    //         'user-audit',
    //         user_audit_body,
    //         this.currentUser.email,
    //         this.productId
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     let user_audit_body = {
    //       method: 'GET',
    //       url: error?.request?.responseURL,
    //     };
    //     this.auditUtil.postAudit(
    //       'GET_ALL_PRODUCTS_GET_METADATA_TEMPLATE_BUILDER_PUBLISH_HEADER',
    //       1,
    //       'FAILED',
    //       'user-audit',
    //       user_audit_body,
    //       this.currentUser.email,
    //       this.productId
    //     );
    //     this.utilsService.loadToaster({
    //       severity: 'error',
    //       summary: '',
    //       detail: error,
    //     });
    //   });
  }

  checkProductOptions() {
    if (this.currentUser?.email == this.product?.email) {
      this.utilsService.hasProductPermission(true);
    } else {
      this.utilsService.hasProductPermission(false);
    }
  }
}
