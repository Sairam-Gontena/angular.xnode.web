import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserUtil } from '../../utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { UtilsService } from '../services/utils.service';
import { NotifyApiService } from 'src/app/api/notify.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecUtilsService } from '../services/spec-utils.service';
import { CommentsService } from 'src/app/api/comments.service';
import { SpecApiService } from 'src/app/api/spec-api.service';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { Product } from 'src/models/product';
import { SpecificationUtilsService } from 'src/app/pages/diff-viewer/specificationUtils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { SpecVersion } from 'src/models/spec-versions';

@Component({
  selector: 'xnode-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent {
  @Input() data: any;
  @Output() preparePublishPopup = new EventEmitter<any>();
  @Output() showMeLimitInfoPopup = new EventEmitter<any>();
  @Output() closeNotificationPanel = new EventEmitter<any>();
  @Input() limitReachedContent: boolean = false;
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
    private specUtils: SpecUtilsService,
    private commentsService: CommentsService,
    private specService: SpecApiService,
    private naviApiService: NaviApiService,
    private specificationUtils: SpecificationUtilsService,
    private specificationService: SpecificationsService
  ) {}

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
    this.naviApiService
      .getMetaData(this.currentUser?.email)
      .then((response) => {
        if (response?.status === 200 && response.data.data?.length) {
          const product = response.data.data?.filter((item: any) => {
            return item.id === obj.product_id;
          })[0];
          localStorage.setItem('product', JSON.stringify(product));
          this.prepareNavigation(obj);
        }
      });
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
    this.naviApiService
      .getMetaData(this.currentUser?.email)
      .then((response) => {
        if (response?.status === 200 && response.data.data?.length) {
          localStorage.setItem('meta_data', JSON.stringify(response.data.data));
        }
      });
  }
  getMeMetaData() {
    this.naviApiService
      .getMetaData(this.currentUser?.email)
      .then((response) => {
        if (response?.status === 200 && response.data.data?.length) {
          localStorage.setItem('meta_data', JSON.stringify(response.data.data));
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
  }

  goToCr(obj: any) {
    this.storeProductInfoForDeepLink('deep_link_info', obj)
      .then(() => {
        this.router.navigate(['/specification']);
      })
      .catch((error) => {
        console.error('Error storing data:', error);
      });
  }

  goToSpec(obj: any) {
    this.utils.loadSpinner(true);
    this.naviApiService
      .getMetaData(this.currentUser?.email)
      .then((response) => {
        if (response?.status === 200 && response.data.data?.length) {
          const metaData: any = response.data.data;
          this.storageService.saveItem(
            StorageKeys.MetaData,
            response.data.data
          );

          let product = metaData.find((x: any) => x.id === obj.product_id);
          if (!window.location.hash.includes('#/specification')) {
            this.setProductDetailsInThStore(product);
            this.closeNotificationPanel.emit(true);
          } else {
            if (obj.entity === 'UPDATE_SPEC') {
              localStorage.setItem('record_id', product.productId);
              localStorage.setItem('product', JSON.stringify(product));
              localStorage.setItem('app_name', product.title);
              localStorage.setItem('has_insights', product.has_insights);
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
                        this.specificationService.getMeCrList({
                          productId: product.id,
                        });
                        this.storageService.saveItem(
                          StorageKeys.SpecVersion,
                          versions.filter((version: SpecVersion) => {
                            return version.id === obj.versionId;
                          })[0]
                        );
                        this.specificationUtils.openConversationPanel({
                          openConversationPanel: true,
                          mainTabIndex: 1,
                          childTabIndex: null,
                        });
                      }
                    }
                  );
                }
              );
            } else {
              this.setProductDetailsInThStore(product);
            }
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
  }
  setProductDetailsInThStore(product: any): void {
    product.productId = product.product_id
      ? product.product_id
      : product.productId;
    localStorage.setItem('record_id', product.productId);
    localStorage.setItem('product', JSON.stringify(product));
    localStorage.setItem('app_name', product.title);
    localStorage.setItem('has_insights', product.has_insights);
    this.router.navigate(['/specification']);
    this.closeNotificationPanel.emit(true);
  }

  getVersions(obj: any) {
    this.utils.loadSpinner(true);
    this.specService
      .getVersionIds(obj?.product_id ? obj.product_id : obj.productId)
      .then((response) => {
        if (response.status === 200 && response.data) {
          this.getMeSpecInfo({
            versions: response.data,
            productId: obj.product_id ? obj.product_id : obj.productId,
            versionId: obj.versionId,
          });
          this.getMeCrList({
            productId: obj.product_id ? obj.product_id : obj.productId,
          });
          this.specUtils._updatedSelectedProduct(true);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: 'Network Error',
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

  getMeSpecInfo(body?: any) {
    this.specService
      .getSpec({ productId: body.productId, versionId: body.versionId })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          this.specUtils._getLatestSpecVersions({
            versions: body.versions,
            specData: response.data,
            productId: body.productId,
            versionId: body.versionId,
          });
        }
        this.utils.loadSpinner(false);
        this.closeNotificationPanel.emit(true);
      })
      .catch((error) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.utils.loadSpinner(false);
        this.closeNotificationPanel.emit(true);
      });
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
    this.naviApiService
      .getMetaData(this.currentUser?.email)
      .then((response) => {
        if (response?.status === 200 && response.data.data?.length) {
          const product = response.data.data?.filter((item: any) => {
            return item.id === product_id;
          })[0];
          localStorage.setItem('product', JSON.stringify(product));
        }
      });
  }

  navigateToConversation(val: any) {
    this.utils.loadSpinner(true);
    this.naviApiService
      .getMetaData(this.currentUser?.email)
      .then((response) => {
        if (response?.status === 200 && response.data.data?.length) {
          const product = response.data.data?.filter((item: any) => {
            return item.id === val.product_id ? val.product_id : val.productId;
          })[0];
          this.storageService.saveItem(StorageKeys.Product, product);
          this.goToConversation(val);
        }
      });
  }

  goToConversation(val: any) {
    let notifInfo: any = val;
    notifInfo.productId = val.product_id ? val.product_id : val.productId;
    notifInfo.versionId = val.version_id ? val.version_id : val.versionId;
    if (!window.location.hash.includes('#/specification')) {
      const metaData: any = this.storageService.getItem(StorageKeys.MetaData);
      let product = metaData.find(
        (x: any) => x.id === val.product_id || x.id === val.productId
      );
      this.storageService.saveItem(
        StorageKeys.Product,
        JSON.stringify(product)
      );
      localStorage.setItem('record_id', product.id);
      localStorage.setItem('product', JSON.stringify(product));
      localStorage.setItem('app_name', product.title);
      localStorage.setItem('has_insights', product.has_insights);
      this.storageService.saveItem(StorageKeys.NOTIF_INFO, val);
      if (val.entity === 'WORKFLOW') {
        this.specUtils.saveActivatedTab('CR');
      }
      this.router.navigate(['/specification']);
    } else {
      if (val.template_type === 'TASK') {
        this.getMeAllTaskList(notifInfo);
      }
      if (val.template_type === 'COMMENT') {
        this.getMeAllCommentsTasks(notifInfo);
      }
      if (val.template_type === 'CR') {
        this.getMeCrList(notifInfo);
      }
      if (val.entity === 'WORKFLOW') {
        this.getVersions(notifInfo);
      }
    }
    this.closeNotificationPanel.emit(true);
  }

  getMeCrList(notifInfo: any) {
    let body: any = {
      productId: notifInfo.productId,
    };
    this.utils.loadSpinner(true);
    this.commentsService
      .getCrList(body)
      .then((res: any) => {
        if (res && res.data) {
          this.specUtils._openCommentsPanel(true);
          this.specUtils._loadActiveTab(1);
          this.specUtils._getMeUpdatedCrs(res.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utils.loadSpinner(false);
      });
  }

  handleNotification(val: any) {
    if (val.template_type === 'TASK') {
      this.getMeAllTaskList(val);
    } else {
      this.specUtils._openCommentsPanel(true);
      this.specUtils._loadActiveTab({
        activeIndex: 1,
        productId: val.product_id,
        versionId: val.version_id,
      });
      this.router.navigate(['/specification']);
    }
  }

  getMeAllTaskList(obj: any) {
    this.utils.loadSpinner(true);
    this.commentsService
      .getTasksByProductId({
        productId: obj.productId,
        versionId: obj.versionId,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils._getMeUpdatedTasks(response.data);
          this.specUtils._openCommentsPanel(true);
          this.specUtils._getSpecBasedOnVersionID(obj);
          this.specUtils._tabToActive(obj.template_type);
          this.router.navigate(['/specification']);
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
  }
  getMeAllCommentsTasks(obj: any) {
    this.utils.loadSpinner(true);
    this.commentsService
      .getCommentsByProductId({
        productId: obj.productId,
        versionId: obj.versionId,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils._getMeUpdatedComments(response.data);
          this.specUtils._openCommentsPanel(true);
          this.specUtils._getSpecBasedOnVersionID(obj);
          this.specUtils._tabToActive(obj.template_type);
          this.router.navigate(['/specification']);
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
  }

  ngOnDestroy(): void {
    this.specUtils._getSpecBasedOnVersionID(null);
  }

  getAllProductsInfo(key: string) {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(key);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

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
}
