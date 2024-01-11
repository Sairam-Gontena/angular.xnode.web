import { Component, OnInit } from '@angular/core';
import { UtilsService } from './components/services/utils.service';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuditutilsService } from './api/auditutils.service';
import { ApiService } from './api/api.service';
import { NotifyApiService } from './api/notify.service';
import { AuthApiService } from './api/auth.service';
import { debounce, delay } from 'rxjs/operators';
import { interval, of } from 'rxjs';
import { SidePanel } from 'src/models/side-panel.enum';
import { SpecUtilsService } from './components/services/spec-utils.service';
import { NaviApiService } from './api/navi-api.service';
@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  title = 'xnode';
  isSideWindowOpen: boolean = false;
  showProductStatusPopup: boolean = false;
  isBotIconVisible: boolean = true;
  email: String = '';
  id: String = '';
  loading: boolean = true;
  isNaviExpanded?: boolean;
  sideWindow: any = document.getElementById('side-window');
  productContext: string | null = '';
  iframeUrl: SafeResourceUrl = '';
  toastObj: any;
  targetUrl: string = environment.naviAppUrl;
  currentUser: any;
  showLimitReachedPopup?: boolean;
  productAlertPopup: boolean = false;
  content: any;
  contentFromNavi: boolean = false;
  showCommentIcon?: boolean;
  screenWidth: number;
  screenHeight: number;
  deepLink: boolean = false;

  constructor(
    private domSanitizer: DomSanitizer,
    private router: Router,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private subMenuLayoutUtil: UtilsService,
    private spinner: NgxSpinnerService,
    private auditUtil: AuditutilsService,
    public auth: AuthApiService,
    private notifyApi: NotifyApiService,
    private specUtils: SpecUtilsService,
    private naviApiService: NaviApiService
  ) {
    let winUrl = window.location.href;
    if (
      winUrl.includes('template_id') ||
      winUrl.includes('template_type') ||
      winUrl.includes('crId') ||
      winUrl.includes('versionId')
    ) {
      this.deepLink = true;
      this.setDeepLinkInfo(winUrl);
    } else {
      this.deepLink = false;
    }
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          this.showLimitReachedPopup = false;
        }
        if (event.url == '/x-pilot') {
          let product = localStorage.getItem('product');
          let user = localStorage.getItem('currentUser');
          if (product && user) {
            let productObj = JSON.parse(product);
            let userObj = JSON.parse(user);
            if (
              productObj?.has_insights == false &&
              userObj?.email == productObj?.email
            ) {
              let data = {
                popup: true,
                data: {},
              };
              this.utilsService.toggleProductAlertPopup(data);
            }
          }
        }
        if (event.url == '/my-products') {
          this.isSideWindowOpen = false;
        }
      }
    });
    this.utilsService.startSpinner.subscribe((event: boolean) => {
      if (event && this.router.url != '/dashboard') {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });

    this.specUtils.openCommentsPanel.subscribe((event: any) => {
      if (event) {
        this.isSideWindowOpen = false;
      }
    });
  }

  async setDeepLinkInfo(winUrl: any) {
    let urlObj = new URL(winUrl);
    let hash = urlObj.hash;
    let [path, queryString] = hash.substr(1).split('?');
    let params = new URLSearchParams(queryString);
    this.navigateByDeepLink(params);
  }

  async navigateByDeepLink(params: any) {
    let templateId = params.get('template_id');
    let templateType = params.get('template_type');
    let productId = params.get('product_id');
    let versionId = params.get('version_id');

    let crId = params.get('crId');
    let entity = params.get('entity');
    if ((templateId && templateType) || (crId && entity)) {
      let deepLinkInfo;
      if (templateId && templateType) {
        deepLinkInfo = {
          product_id: productId,
          template_id: templateId,
          template_type: templateType,
          version_id: versionId,
        };
      }
      if (crId && entity) {
        versionId = params.get('versionId');
        productId = params.get('productId');
        deepLinkInfo = {
          product_id: productId,
          entity: entity,
          cr_id: crId,
          version_id: versionId,
        };
        this.specUtils._openCommentsPanel(true);
        this.specUtils._loadActiveTab({
          activeIndex: 1,
          productId: deepLinkInfo.product_id,
          versionId: deepLinkInfo.version_id,
        });
      }
      await this.setDeepLinkInStorage(deepLinkInfo);
      this.router.navigateByUrl('specification');
    }
  }

  setDeepLinkInStorage(deepLinkInfo: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.setItem('deep_link_info', JSON.stringify(deepLinkInfo));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
      this.getMeTotalOnboardedApps(JSON.parse(currentUser));
      if (this.currentUser.role_name === 'Xnode Admin') {
        this.router.navigate(['/admin/user-invitation']);
      } else {
        this.router.navigate(['/my-products']);
      }
      this.preparingData();
      this.handleBotIcon();
    } else {
      if (!window.location.hash.includes('#/reset-password?email')) {
        this.router.navigate(['/']);
        localStorage.clear();
      }
      this.utilsService.getMeToastObject.subscribe((event: any) => {
        this.messageService.add(event);
      });
    }
    if (!window.location.hash.includes('#/reset-password?email'))
      this.redirectToPreviousUrl();
    this.utilsService.sidePanelChanged.subscribe((pnl: SidePanel) => {
      this.isSideWindowOpen = false;
      this.isNaviExpanded = false;
      this.utilsService.disableDockedNavi();
    });
    this.utilsService.getMeproductAlertPopup.subscribe((data: any) => {
      this.showProductStatusPopup = data.popup;
    });
    this.utilsService.getMeProductDetails.subscribe((data: any) => {
      if (data && data?.email) {
        this.makeTrustedUrl(data.email);
      }
    });
    this.utilsService.openDockedNavi.subscribe((data: any) => {
      this.isSideWindowOpen = data;
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

  botOnClick() {
    this.isNaviExpanded = false;
    this.subMenuLayoutUtil.EnableDockedNavi();
  }

  redirectToPreviousUrl(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        localStorage.setItem('previousUrl', event.url);
      }
    });
    const previousUrl = localStorage.getItem('previousUrl');
    if (previousUrl) {
      localStorage.removeItem('previousUrl');
      if (this.deepLink) {
        this.router.navigateByUrl('specification');
      } else {
        this.router.navigateByUrl(previousUrl);
      }
    }
  }

  preparingData() {
    this.utilsService.getMeToastObject.subscribe((event: any) => {
      this.messageService.add(event);
    });
    this.utilsService.getMeProductStatus.subscribe((event: any) => {
      this.showProductStatusPopup = event;
    });
    this.utilsService.handleLimitReachedPopup
      .pipe(debounce(() => interval(1000)))
      .subscribe((event: any) => {
        this.showLimitReachedPopup = event;
        if (event) {
          let currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
          }
          this.sendEmailNotificationToTheUser();
        }
      });
  }
  handleBotIcon() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/x-pilot') {
          this.isBotIconVisible = false;
        } else {
          this.isBotIconVisible = true;
        }
      }
    });
  }
  getMeTotalOnboardedApps(user: any): void {
    this.naviApiService
      .getTotalOnboardedApps(user?.email)
      .then((response: any) => {
        if (response?.status === 200) {
          localStorage.setItem(
            'total_apps_onboarded',
            response.data.total_apps_onboarded
          );
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: '',
            detail: response.data?.detail,
          });
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: '',
          detail: error,
        });
        this.utilsService.loadSpinner(true);
      });
  }

  loadIframeUrl(): void {
    window.addEventListener('message', (event) => {
      if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
        return;
      }
      if (event.data.message === 'triggerCustomEvent') {
        this.isSideWindowOpen = false;
        this.isNaviExpanded = false;
      }
      if (event.data.message === 'close-docked-navi') {
        this.isSideWindowOpen = false;
        this.isNaviExpanded = false;
        this.utilsService.disableDockedNavi();
        this.refreshCurrentRoute();
      }
      if (event.data.message === 'expand-navi') {
        this.isNaviExpanded = true;
      }
      if (event.data.message === 'contract-navi') {
        this.isNaviExpanded = false;
      }
      if (event.data.message === 'triggerProductPopup') {
        this.content = event.data.data;
        let data = {
          popup: true,
          data: this.content,
        };
        this.utilsService.toggleProductAlertPopup(data);
      }
      if (event.data.message === 'change-app') {
        this.utilsService.saveProductId(event.data.id);
        if (this.currentUser?.email == event.data.product_user_email) {
          this.utilsService.hasProductPermission(true);
        } else {
          this.utilsService.hasProductPermission(false);
        }
      }
    });

    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        window.addEventListener('message', (event) => {
          if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
            return;
          }
          if (event.data.message === 'triggerCustomEvent') {
            this.isSideWindowOpen = false;
            this.isNaviExpanded = false;
          }
          if (event.data.message === 'close-docked-navi') {
            this.isSideWindowOpen = false;
            this.isNaviExpanded = false;
          }
          if (event.data.message === 'expand-navi') {
            this.isNaviExpanded = true;
          }
          if (event.data.message === 'contract-navi') {
            this.isNaviExpanded = false;
          }
        });
      }
    });
  }

  refreshCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      localStorage.setItem('trigger', 'graph');
      this.router.navigate([currentUrl]);
    });
  }

  closePopup() {
    this.showProductStatusPopup = false;
  }

  getUserData() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser && localStorage.getItem('record_id')) {
      this.email = JSON.parse(currentUser).email;
    }
  }

  makeTrustedUrl(productEmail: string): void {
    let user = localStorage.getItem('currentUser');
    let id;
    const has_insights = localStorage.getItem('has_insights');
    if (localStorage.getItem('record_id') !== null) {
      this.subMenuLayoutUtil.disablePageToolsLayoutSubMenu();
      if (user) {
        id = JSON.parse(user).user_id;
      }
      let rawUrl =
        environment.naviAppUrl +
        '?email=' +
        this.email +
        '&productContext=' +
        localStorage.getItem('record_id') +
        '&targetUrl=' +
        environment.xnodeAppUrl +
        '&xnode_flag=' +
        'XNODE-APP' +
        '&component=' +
        this.getMeComponent() +
        '&user_id=' +
        id +
        '&product_user_email=' +
        productEmail +
        '&device_width=' +
        this.screenWidth;
      if (has_insights) {
        rawUrl = rawUrl + '&has_insights=' + JSON.parse(has_insights);
      }
      setTimeout(() => {
        this.iframeUrl =
          this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        this.loadIframeUrl();
      }, 2000);
    } else {
      alert('Invalid record id');
      this.isSideWindowOpen = false;
    }
  }

  getMeComponent() {
    let comp = '';
    switch (this.router.url) {
      case '/dashboard':
        comp = 'dashboard';
        break;
      case '/overview':
        comp = 'overview';
        break;
      case '/usecases':
        comp = 'usecase';
        break;
      case '/configuration/workflow/overview':
        comp = 'xflows';
        break;
      case '/configuration/data-model/overview':
        comp = 'data_model';
        break;
      case '/operate':
        comp = 'operate';
        break;
      case '/publish':
        comp = 'publish';
        break;
      case '/specification':
        comp = 'specification';
        break;
      case '/operate/change/history-log':
        comp = 'history-log';
        break;
      default:
        break;
    }
    return comp;
  }

  isUserExists() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser;
  }

  openNavi(newItem: any) {
    if (
      window.location.hash === '#/my-products' ||
      window.location.hash === '#/help-center' ||
      window.location.hash === '#/history-log'
    ) {
      let currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        this.auditUtil.postAudit('NAVI_OPENED', 1, 'SUCCESS', 'user-audit');
      }
      this.router.navigate(['/x-pilot']);
    } else {
      this.getUserData();
      this.isSideWindowOpen = newItem.cbFlag;
      this.productContext = newItem.productContext;
      this.makeTrustedUrl(newItem.productEmail);
    }
  }

  toggleSideWindow() {
    this.isSideWindowOpen = !this.isSideWindowOpen;
    const chatbotContainer = document.getElementById(
      'side-window'
    ) as HTMLElement;
    chatbotContainer.classList.remove('open');
    chatbotContainer.classList.add('chatbot-closing');
    setTimeout(() => {
      chatbotContainer.style.display = 'none';
      chatbotContainer.classList.remove('chatbot-closing');
    }, 1000);
  }

  submenuFunc() {
    if (this.isSideWindowOpen) {
      const chatbotContainer = document.getElementById(
        'side-window'
      ) as HTMLElement;
      chatbotContainer.style.display = 'block';
      chatbotContainer.classList.add('open');
    }
  }

  closeSideWindow() {
    this.isSideWindowOpen = false;
  }

  showSideMenu() {
    const hashWithoutParams = window.location.hash.split('?')[0];

    return (
      hashWithoutParams === '#/configuration/data-model/overview' ||
      hashWithoutParams === '#/usecases' ||
      hashWithoutParams === '#/specification' ||
      hashWithoutParams === '#/overview' ||
      hashWithoutParams === '#/dashboard' ||
      hashWithoutParams === '#/operate' ||
      hashWithoutParams === '#/publish' ||
      hashWithoutParams === '#/activity' ||
      hashWithoutParams === '#/configuration/workflow/overview' ||
      hashWithoutParams === '#/admin/user-invitation' ||
      hashWithoutParams === '#/admin/user-approval' ||
      hashWithoutParams === '#/configuration/workflow/overview' ||
      hashWithoutParams === '#/logs' ||
      hashWithoutParams === '#/operate/change/history-log'
    );
  }

  sendEmailNotificationToTheUser(): void {
    const body = {
      to: [this.currentUser?.email],
      cc: ['beta@xnode.ai'],
      bcc: ['dev.xnode@salientminds.com'],
      emailTemplateCode: 'CREATE_APP_LIMIT_EXCEEDED',
      params: {
        username:
          this.currentUser?.first_name + ' ' + this.currentUser?.last_name,
      },
    };
    this.notifyApi
      .post('email/notify', body)
      .then((res: any) => {
        if (res?.data?.detail) {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.detail,
          });
        }
      })
      .catch((err: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err?.response?.data?.detail,
        });
      });
  }
}
