import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { UtilsService } from '../services/utils.service';
import { NotifyApiService } from 'src/app/api/notify.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { Product } from 'src/models/product';
import { SpecificationUtilsService } from 'src/app/pages/diff-viewer/specificationUtils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { SpecVersion } from 'src/models/spec-versions';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';

@Component({
  selector: 'xnode-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent {
  @Input() data: any;
  @Output() preparePublishPopup = new EventEmitter<any>();
  @Output() viewSummaryPopup = new EventEmitter<any>();
  @Output() showMeLimitInfoPopup = new EventEmitter<any>();
  @Output() closeNotificationPanel = new EventEmitter<any>();
  @Input() limitReachedContent: boolean = false;
  showViewSummaryPopup: boolean = false;
  notifications: any[] = [];
  activeFilter: string = '';
  allNotifications: any[] = [];
  currentUser?: any;
  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true,
  };
  product?: Product;
  nonProductContextRoutes = ['/my-products', '/feedback-list', '/help-center'];

  constructor(
    private router: Router,
    private auditUtil: AuditutilsService,
    public utils: UtilsService,
    private notifyApi: NotifyApiService,
    private storageService: LocalStorageService,
    private naviApiService: NaviApiService,
    private specificationUtils: SpecificationUtilsService,
    private specificationService: SpecificationsService,
    private conversationService: ConversationHubService
  ) { }

  ngOnInit(): void {
    this.allNotifications = this.data;
    this.notifications = this.allNotifications;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
  }

  getMeComponent(comp: any) {
    let path = '';
    switch (comp) {
      case 'dashboard':
        path = 'dashboard';
        break;
      case 'overview':
        path = 'overview';
        break;
      case 'usecases':
        path = 'usecase';
        break;
      case 'xflows':
        path = 'configuration/workflow/overview';
        break;
      case 'data_model':
        path = 'configuration/data-model/overview';
        break;
      case 'operate':
        path = 'operate';
        break;
      case 'publish':
        path = 'publish';
        break;
      default:
        break;
    }
    return path;
  }

  navigateToProduct(obj: any): void {
    this.conversationService.getMetaData({ accountId: this.currentUser.account_id }).then((response) => {
      if (response?.status === 200 && response.data?.length) {
        const product = response.data?.filter((item: any) => {
          return item.id === obj.product_id;
        })[0];
        localStorage.setItem('product', JSON.stringify(product));
        this.prepareNavigation(obj);
      }
    });
    // this.naviApiService
    //   .getMetaData(this.currentUser?.email)
    //   .then((response) => {
    //     if (response?.status === 200 && response.data.data?.length) {
    //       const product = response.data.data?.filter((item: any) => {
    //         return item.id === obj.product_id;
    //       })[0];
    //       localStorage.setItem('product', JSON.stringify(product));
    //       this.prepareNavigation(obj);
    //     }
    //   });
  }

  prepareNavigation(obj: any): void {
    localStorage.setItem('record_id', obj.product_id);
    localStorage.setItem('app_name', obj.product_name);
    this.utils.saveProductId(obj.product_id);
    if (obj.component && obj.component !== '') {
      if (window.location.hash === '#/' + obj.component) {
        window.location.reload();
      } else {
        this.router.navigate(['/' + this.getMeComponent(obj.component)]);
      }
      this.auditUtil.postAudit(obj.component, 1, 'SUCCESS', 'user-audit');
    } else {
      this.utils.loadSpinner(true);
      this.getMeMetaData();
    }
    this.closeNotificationPanel.emit(true);
  }

  getMeListOfProducts(): void {
    this.conversationService.getMetaData({ accountId: this.currentUser.account_id }).then((response) => {
      if (response?.status === 200 && response.data?.length) {
        localStorage.setItem('meta_data', JSON.stringify(response.data));
      }
    });
    // this.naviApiService
    //   .getMetaData(this.currentUser?.email)
    //   .then((response) => {
    //     if (response?.status === 200 && response.data.data?.length) {
    //       localStorage.setItem('meta_data', JSON.stringify(response.data.data));
    //     }
    //   });
  }
  getMeMetaData() {
    this.conversationService.getMetaData({ accountId: this.currentUser.account_id }).then((response) => {
      if (response?.status === 200 && response.data?.length) {
        localStorage.setItem('meta_data', JSON.stringify(response.data));
        this.router.navigate(['/dashboard']);
        this.auditUtil.postAudit('DASHBOARD', 1, 'FAILURE', 'user-audit');
      } else if (response?.status !== 200) {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: response?.data?.detail,
        });
      }
      this.utils.loadSpinner(false);
    })
      .catch((error) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      });
    // this.naviApiService
    //   .getMetaData(this.currentUser?.email)
    //   .then((response) => {
    //     if (response?.status === 200 && response.data.data?.length) {
    //       localStorage.setItem('meta_data', JSON.stringify(response.data.data));
    //       this.router.navigate(['/dashboard']);
    //       this.auditUtil.postAudit('DASHBOARD', 1, 'FAILURE', 'user-audit');
    //     } else if (response?.status !== 200) {
    //       this.utils.loadToaster({
    //         severity: 'error',
    //         summary: 'ERROR',
    //         detail: response?.data?.detail,
    //       });
    //     }
    //     this.utils.loadSpinner(false);
    //   })
    //   .catch((error) => {
    //     this.utils.loadSpinner(false);
    //     this.utils.loadToaster({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: error,
    //     });
    //   });
  }

  goToSpec(obj: any) {
    obj.productId = obj.productId ? obj.productId : obj.product_id;
    obj.versionId = obj.versionId ? obj.versionId : obj.version_id;
    this.utils.loadSpinner(true);
    this.conversationService.getMetaData({ accountId: this.currentUser.account_id }).then((response: any) => {
      if (response?.status === 200 && response.data?.length) {
        const metaData: any = response.data;
        this.storageService.saveItem(
          StorageKeys.MetaData,
          response.data
        );
        let product = metaData.find((x: any) => x.id === obj.productId);
        localStorage.setItem('record_id', product.id);
        this.storageService.saveItem(StorageKeys.Product, product);
        localStorage.setItem('app_name', product.title);
        localStorage.setItem('has_insights', product.has_insights);
        if (!window.location.hash.includes('#/specification')) {
          this.closeNotificationPanel.emit(true);
          const queryParams = {
            productId: obj.productId,
            versionId: obj.versionId,
            template_type: obj.template_type ? obj.template_type : obj.entity,
          };
          this.router.navigate(['/specification'], { queryParams });
        } else {
          this.specificationService.getVersions(
            product?.id,
            (versions: SpecVersion[]) => {
              this.specificationService.getMeSpecInfo(
                {
                  productId: product?.id,
                  versionId: obj.versionId,
                },
                (specList) => {
                  if (specList) {
                    this.storageService.saveItem(
                      StorageKeys.SpecVersion,
                      versions.filter((version: SpecVersion) => {
                        return version.id === obj.versionId;
                      })[0]
                    );
                    if (obj.entity === 'UPDATE_SPEC') {
                      this.specificationService.getMeCrList({
                        productId: product.id,
                      });
                      this.specificationUtils.openConversationPanel({
                        openConversationPanel: true,
                        mainTabIndex: 1,
                        childTabIndex: null,
                      });
                    }
                  }
                }
              );
            }
          );
          this.closeNotificationPanel.emit(true);
        }
      } else if (response?.status !== 200) {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: response?.data?.detail,
        });
      }
      this.utils.loadSpinner(false);
    })
      .catch((error) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      });
    // this.naviApiService
    //   .getMetaData(this.currentUser?.email)
    //   .then((response) => {
    //     if (response?.status === 200 && response.data.data?.length) {
    //       const metaData: any = response.data.data;
    //       this.storageService.saveItem(
    //         StorageKeys.MetaData,
    //         response.data.data
    //       );
    //       let product = metaData.find((x: any) => x.id === obj.productId);
    //       localStorage.setItem('record_id', product.id);
    //       this.storageService.saveItem(StorageKeys.Product, product);
    //       localStorage.setItem('app_name', product.title);
    //       localStorage.setItem('has_insights', product.has_insights);
    //       if (!window.location.hash.includes('#/specification')) {
    //         this.closeNotificationPanel.emit(true);
    //         const queryParams = {
    //           productId: obj.productId,
    //           versionId: obj.versionId,
    //           template_type: obj.template_type ? obj.template_type : obj.entity,
    //         };
    //         this.router.navigate(['/specification'], { queryParams });
    //       } else {
    //         this.specificationService.getVersions(
    //           product?.id,
    //           (versions: SpecVersion[]) => {
    //             this.specificationService.getMeSpecInfo(
    //               {
    //                 productId: product?.id,
    //                 versionId: obj.versionId,
    //               },
    //               (specList) => {
    //                 if (specList) {
    //                   this.storageService.saveItem(
    //                     StorageKeys.SpecVersion,
    //                     versions.filter((version: SpecVersion) => {
    //                       return version.id === obj.versionId;
    //                     })[0]
    //                   );
    //                   if (obj.entity === 'UPDATE_SPEC') {
    //                     this.specificationService.getMeCrList({
    //                       productId: product.id,
    //                     });
    //                     this.specificationUtils.openConversationPanel({
    //                       openConversationPanel: true,
    //                       mainTabIndex: 1,
    //                       childTabIndex: null,
    //                     });
    //                   }
    //                 }
    //               }
    //             );
    //           }
    //         );
    //         this.closeNotificationPanel.emit(true);
    //       }
    //     } else if (response?.status !== 200) {
    //       this.utils.loadToaster({
    //         severity: 'error',
    //         summary: 'ERROR',
    //         detail: response?.data?.detail,
    //       });
    //     }
    //     this.utils.loadSpinner(false);
    //   })
    //   .catch((error) => {
    //     this.utils.loadSpinner(false);
    //     this.utils.loadToaster({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: error,
    //     });
    //   });
  }

  getMeLabel(obj: any) {
    return obj.component && obj.component !== ''
      ? 'View Update'
      : 'Go to Product';
  }

  onClickSeeAll() {
    this.utils.disableDockedNavi();
    this.closeNotificationPanel.emit(true);
    this.router.url;
    if (
      this.nonProductContextRoutes.filter((route) => {
        return route === this.router.url;
      }).length > 0
    ) {
      this.router.navigate(['/history-log']);
    } else {
      this.router.navigate(['/operate/change/history-log']);
    }
  }

  onClickProductUrl() {
    this.auditUtil.postAudit(
      'PRODUCT_URL_CLICKED_FROM_NOTIFICATION_PANEL',
      1,
      'FAILURE',
      'user-audit'
    );
  }

  filterNotifications(val: any) {
    if (val === 'all') {
      this.filterTypes = {
        recent: false,
        important: false,
        pinned: false,
        all: true,
      };
      this.notifications = this.allNotifications;
    } else {
      this.filterTypes = {
        recent: false,
        important: false,
        pinned: false,
        all: false,
        [val]: true,
      };
      this.notifications = this.allNotifications.filter((x) => x[val]);
    }
  }

  toggleNotificationRead(val: any, id: number) {
    const index = this.allNotifications.findIndex((item) => item.id === id);
    this.allNotifications[index].read = val === 'read';
  }

  toggleNotificationPinned(val: any, id: number) {
    const index = this.allNotifications.findIndex((item) => item.id === id);
    this.allNotifications[index].pinned = val === 'pinned';
  }

  onClickPublish(obj: any): void {
    this.limitReachedContent = true;
    this.getMeTotalAppsPublishedCount(obj);
  }

  getMeTotalAppsPublishedCount(obj: any): void {
    this.naviApiService
      .getTotalPublishedApps(this.currentUser?.account_id)
      .then((res: any) => {
        if (res && res.status === 200) {
          const restriction_max_value = localStorage.getItem(
            'restriction_max_value'
          );
          if (restriction_max_value) {
            if (res.data.total_apps_published >= restriction_max_value) {
              this.showMeLimitInfoPopup.emit(true);
              this.sendEmailNotificationToTheUser();
            } else {
              this.publishApp(obj);
            }
          }
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_ME_TOTAL_APPS_PUBLISHED_COUNT_NOTIFICATION_PANEL',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.emil,
            this.product?.id
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_ME_TOTAL_APPS_PUBLISHED_COUNT_NOTIFICATION_PANEL',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.emil,
            this.product?.id
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data.detail,
            life: 3000,
          });
        }
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'GET',
          url: err?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_ME_TOTAL_APPS_PUBLISHED_COUNT_NOTIFICATION_PANEL',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.emil,
          this.product?.id
        );
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
          this.currentUser?.first_name + ' ' + this.currentUser?.last_name,
      },
    };
    this.notifyApi
      .emailNotify(body)
      .then((res: any) => {
        if (res && res?.data?.detail) {
          let user_audit_body = {
            method: 'POST',
            url: res?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'SEND_EMAIL_NOTIFICATION_TO_USER_NOTIFICATION_PANEL',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.emil,
            this.product?.id
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data.detail,
          });
        }
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'POST',
          url: err?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'SEND_EMAIL_NOTIFICATION_TO_USER_NOTIFICATION_PANEL',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.emil,
          this.product?.id
        );
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  publishApp(obj: any): void {
    localStorage.setItem('record_id', obj.product_id);
    localStorage.setItem('app_name', obj.product_name);
    this.preparePublishPopup.emit(obj);
    this.auditUtil.postAudit(
      'PUBLISH_APP_FROM_NOTIFICATION',
      1,
      'SUCCESS',
      'user-audit'
    );
  }

  onClickLaunchProduct(url: any): void {
    window.open(url, '_blank');
  }

  navigateToFeedbackList(val: any) {
    this.closeNotificationPanel.emit(true);
    if (val.title === 'USER_BUG_REPORT') {
      this.router.navigate(['/feedback-list'], {
        queryParams: { id: val.conversationID, type: 'user-bug-report' },
      });
    } else if (val.title === 'USER_FEEDBACK') {
      this.router.navigate(['/feedback-list'], {
        queryParams: { id: val.conversationID, type: 'user-feedback' },
      });
    }
  }

  getMeMetaDataAndStoreTheProduct(product_id: any) {
    this.conversationService.getMetaData({ accountId: this.currentUser.account_id }).then((response) => {
      if (response?.status === 200 && response.data?.length) {
        const product = response.data?.filter((item: any) => {
          return item.id === product_id;
        })[0];
        localStorage.setItem('product', JSON.stringify(product));
      }
    });
    // this.naviApiService
    //   .getMetaData(this.currentUser?.email)
    //   .then((response) => {
    //     if (response?.status === 200 && response.data.data?.length) {
    //       const product = response.data.data?.filter((item: any) => {
    //         return item.id === product_id;
    //       })[0];
    //       localStorage.setItem('product', JSON.stringify(product));
    //     }
    //   });
  }

  navigateToConversation(val: any) {
    val.productId = val.productId ? val.productId : val.product_id;
    val.versionId = val.versionId ? val.versionId : val.version_id;
    this.utils.loadSpinner(true);
    this.conversationService.getMetaData({ accountId: this.currentUser.account_id }).then((response) => {
      if (response?.status === 200 && response.data?.length) {
        const product = response.data?.filter((item: any) => {
          return item.id === val.productId;
        })[0];
        this.storageService.saveItem(StorageKeys.Product, product);
        localStorage.setItem('record_id', product.id);
        localStorage.setItem('app_name', product.title);
        localStorage.setItem('has_insights', product.has_insights);
        this.storageService.saveItem(StorageKeys.NOTIF_INFO, val);
        this.goToConversation(val);
      }
    });
    // this.naviApiService
    //   .getMetaData(this.currentUser?.email)
    //   .then((response) => {
    //     if (response?.status === 200 && response.data.data?.length) {
    //       const product = response.data.data?.filter((item: any) => {
    //         return item.id === val.productId;
    //       })[0];
    //       this.storageService.saveItem(StorageKeys.Product, product);
    //       localStorage.setItem('record_id', product.id);
    //       localStorage.setItem('app_name', product.title);
    //       localStorage.setItem('has_insights', product.has_insights);
    //       this.storageService.saveItem(StorageKeys.NOTIF_INFO, val);
    //       this.goToConversation(val);
    //     }
    //   });
  }

  goToConversation(val: any) {
    if (!window.location.hash.includes('#/specification')) {
      this.closeNotificationPanel.emit(true);
      const queryParams = {
        productId: val.productId,
        versionId: val.versionId,
        template_type: val.template_type ? val.template_type : val.entity,
      };
      this.router.navigate(['/specification'], { queryParams });
    } else {
      this.specificationService.getVersions(
        val?.productId,
        (versions: SpecVersion[]) => {
          this.specificationService.getMeSpecInfo(
            {
              productId: val?.productId,
              versionId: val.versionId,
            },
            (specList) => {
              if (specList) {
                this.storageService.saveItem(
                  StorageKeys.SpecVersion,
                  versions.filter((version: SpecVersion) => {
                    return version.id === val.versionId;
                  })[0]
                );
                if (val.template_type === 'TASK') {
                  this.specificationUtils.openConversationPanel({
                    openConversationPanel: true,
                    parentTabIndex: 0,
                    childTabIndex: 1,
                  });

                  this.specificationService.getMeAllTasks({
                    productId: val.productId,
                    versionId: val.versionId,
                  });
                  this.specificationService.getMeAllTasks({
                    productId: val.productId,
                    versionId: val.versionId,
                  });
                }
                if (val.template_type === 'COMMENT') {
                  this.specificationUtils.openConversationPanel({
                    openConversationPanel: true,
                    parentTabIndex: 0,
                    childTabIndex: 0,
                  });
                  this.specificationService.getMeAllComments({
                    productId: val.productId,
                    versionId: val.versionId,
                  });
                }
                if (val.entity === 'WORKFLOW') {
                  this.specificationUtils.openConversationPanel({
                    openConversationPanel: true,
                    parentTabIndex: 1,
                  });
                  this.specificationService.getMeCrList({
                    productId: val.productId,
                  });
                }
              }
            }
          );
        }
      );
    }
    this.closeNotificationPanel.emit(true);
  }

  ngOnDestroy(): void { }

  storeProductInfoForDeepLink(key: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  viewSummary(notif: any): void {
    this.showViewSummaryPopup = true;
    this.viewSummaryPopup.emit(notif)
  }
}
