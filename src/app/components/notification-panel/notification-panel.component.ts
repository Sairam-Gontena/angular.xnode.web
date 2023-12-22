import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserUtil } from '../../utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { UtilsService } from '../services/utils.service';
import { ApiService } from 'src/app/api/api.service';
import { NotifyApiService } from 'src/app/api/notify.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecUtilsService } from '../services/spec-utils.service';

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
  account_id: any;
  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true,
  };
  email: string = '';
  productId: string = '';
  nonProductContextRoutes = ['/my-products', '/feedback-list', '/help-center'];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private auditUtil: AuditutilsService,
    public utils: UtilsService,
    private notifyApi: NotifyApiService,
    private storageService: LocalStorageService,
    private specUtils: SpecUtilsService
  ) {
    let user = localStorage.getItem('currentUser');
    if (user) {
      let userObj = JSON.parse(user);
      this.email = userObj?.email;
    }
    let product = localStorage.getItem('product');
    if (product) {
      let productObj = JSON.parse(product);
      this.productId = productObj?.id;
    }
  }

  ngOnInit(): void {
    this.allNotifications = this.data;
    this.notifications = this.allNotifications;
    this.currentUser = UserUtil.getCurrentUser();
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
    this.apiService
      .get('navi/get_metadata/' + this.currentUser?.email)
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
    this.apiService
      .get('navi/get_metadata/' + this.currentUser?.email)
      .then((response) => {
        if (response?.status === 200 && response.data.data?.length) {
          localStorage.setItem('meta_data', JSON.stringify(response.data.data));
        }
      });
  }
  getMeMetaData() {
    this.apiService
      .get('navi/get_metadata/' + this.currentUser?.email)
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
    let specData = localStorage.getItem('meta_data')
    if (specData) {
      let products = JSON.parse(specData);
      let product = products.find((x: any) => x.id === obj.product_id);
      if (product) {
        localStorage.setItem('record_id', product.id);
        localStorage.setItem('product', JSON.stringify(product));
        localStorage.setItem('app_name', product.title);
        localStorage.setItem('has_insights', product.has_insights);
        if (obj.component && obj.component !== '') {
          this.utils.toggleSpecPage(true);
          this.router.navigate(['/specification']);
          this.auditUtil.postAudit(obj.component, 1, 'SUCCESS', 'user-audit');
        } else {
          this.router.navigate(['/dashboard']);
          this.auditUtil.postAudit('DASHBOARD', 1, 'FAILURE', 'user-audit');
        }
        this.closeNotificationPanel.emit(true);
      } else {
        this.utils.loadSpinner(true)
        this.apiService
          .get('navi/get_metadata/' + this.currentUser?.email)
          .then((response) => {
            if (response?.status === 200 && response.data.data?.length) {
              localStorage.setItem('meta_data', JSON.stringify(response.data.data));
              let products = response.data.data;
              let product = products.find((x: any) => x.id === obj.product_id);
              if (product) {
                localStorage.setItem('record_id', product.id);
                localStorage.setItem('product', JSON.stringify(product));
                localStorage.setItem('app_name', product.title);
                localStorage.setItem('has_insights', product.has_insights);
                if (obj.component && obj.component !== '') {
                  this.utils.toggleSpecPage(true);
                  this.router.navigate(['/specification']);
                  this.auditUtil.postAudit(obj.component, 1, 'SUCCESS', 'user-audit');
                }
              }
              this.closeNotificationPanel.emit(true);
              this.utils.loadSpinner(false)
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
    }
    this.closeNotificationPanel.emit(true);
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
    this.apiService
      .get('navi/total_apps_published/' + this.currentUser?.account_id)
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
            this.email,
            this.productId
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
            this.email,
            this.productId
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
          this.email,
          this.productId
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
      .post('email/notify', body)
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
            this.email,
            this.productId
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
          this.email,
          this.productId
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

  navigateToConversation(val: any) {
    this.getAllProductsInfo('meta_data')
      .then((result: any) => {
        if (result) {
          let products = JSON.parse(result);
          let product = products.find((x: any) => (x.id === val.product_id || x.id === val.productId));
          localStorage.setItem('record_id', product.id);
          localStorage.setItem('product', JSON.stringify(product));
          localStorage.setItem('app_name', product.title);
          localStorage.setItem('has_insights', product.has_insights);
          this.closeNotificationPanel.emit(true);
          this.storeProductInfoForDeepLink('deep_link_info', val)
            .then(() => {
              if (!window.location.hash.includes('#/specification')) {
                this.specUtils._loadActiveTab({ activeIndex: 1, productId: val.productId, versionId: val.versionId });
                this.router.navigate(['/specification']);
              } else {
                this.specUtils._openCommentsPanel(true);
                this.specUtils._loadActiveTab({ activeIndex: 1, productId: val.productId, versionId: val.versionId });
              }
            })
            .catch((error) => {
              console.error('Error storing data:', error);
            });
        } else {
          console.log('not able to fetch product details');
        }
      })
      .catch((error) => {
        console.error('Error fetching data from localStorage:', error);
      });
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
