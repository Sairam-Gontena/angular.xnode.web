import { Component, OnInit } from '@angular/core';
import { UtilsService } from './components/services/utils.service';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifyApiService } from './api/notify.service';
import { AuthApiService } from './api/auth.service';
import { debounce } from 'rxjs/operators';
import { interval } from 'rxjs';
import { ThemeService } from './theme.service';
import themeing from '../themes/customized-themes.json';
import { NaviApiService } from './api/navi-api.service';
import { LocalStorageService } from './components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecificationUtilsService } from './pages/diff-viewer/specificationUtils.service';
import { MessagingService } from './components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { OverallSummary } from 'src/models/view-summary';
import { ConversationHubService } from './api/conversation-hub.service';
import { AuditutilsService } from './api/auditutils.service';
import { User } from './utils/user-util';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { NaviService } from './api/navi/navi.service';

@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  title = 'xnode';
  showDockedNavi: boolean = true;
  showProductStatusPopup: boolean = false;
  isBotIconVisible: boolean = true;
  email: String = '';
  id: String = '';
  loading: boolean = true;
  isNaviExpanded?: boolean = false;
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
  colorPallet: any;
  firstIteration: boolean = false;
  inXpilotComp: boolean = false;
  product: any;
  mainComponent: string = '';
  showNaviSpinner: boolean = true;
  routes: any = [
    '#/dashboard',
    '#/overview',
    '#/usecases',
    '#/configuration/workflow/overview',
    '#/configuration/data-model/overview',
    '#/operate',
    '#/publish',
    '#/specification',
    '#/operate/change/history-log',
  ];
  usersList: any;
  showImportFilePopup: boolean = false;
  isFileImported: boolean = false;
  showSummaryPopup: boolean = false;
  convSummary?: OverallSummary;
  notifObj: any;
  copnversations: any;
  groupConversations: any;
  oneToOneConversations: any;
  conversation_id: any;
  xnodeAppUrl: string = environment.xnodeAppUrl;
  conversatonDetails: any;
  showInactiveTimeoutPopup?: boolean;
  inactiveTimeoutCounter?: number;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = undefined;
  user?: User | null;

  constructor(private domSanitizer: DomSanitizer,
    private router: Router,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    public authApiService: AuthApiService,
    private notifyApi: NotifyApiService,
    private themeService: ThemeService,
    private naviApiService: NaviApiService,
    private storageService: LocalStorageService,
    private specificationUtils: SpecificationUtilsService,
    private messagingService: MessagingService,
    private conversationHubService: ConversationHubService,
    private auditService: AuditutilsService,
    private idle: Idle,
    private keepalive: Keepalive,
    private naviService: NaviService) {
    let winUrl = this.authApiService.getDeeplinkURL() ? this.authApiService.getDeeplinkURL() : window.location.href;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    if (!this.authApiService.isUserLoggedIn()) {
      this.authApiService.setDeeplinkURL(winUrl);
    }
    if (winUrl.includes('template_id') || winUrl.includes('template_type') || winUrl.includes('crId') ||
      winUrl.includes('versionId') || winUrl.includes('version_id') || winUrl.includes('product_id') || winUrl.includes('naviURL')) {
      this.deepLink = true;
      this.utilsService.setDeepLinkInfo(winUrl);
    } else {
      this.deepLink = false;
    }
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.utilsService.startSpinner.subscribe((event: boolean) => {
      if (event && this.router.url != '/dashboard') {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
    this.specificationUtils._openConversationPanel.subscribe((event: any) => {
      if (event) {
        this.showDockedNavi = false;
      }
    });
    this.utilsService.getMeProductDetails.subscribe((data: any) => {
      if (data && data?.createdBy?.email) {
        this.product = this.storageService.getItem(StorageKeys.Product);
        this.naviService.makeTrustedUrl(data.email);
      }
    });
    this.utilsService.getLatestIframeUrl.subscribe((data: any) => {
      if (data) {
        this.utilsService.EnableDockedNavi();
      }
    });
    this.utilsService.openDockedNavi.subscribe((data: any) => {
      this.showDockedNavi = data;
      if (!data) {
        this.naviService.setNaviExpand(false);
      }
    });
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      this.naviService.setImportPopupToShow(false);
      this.naviService.setNewWithNavi(false);
      if (msg.msgData && msg.msgType === MessageTypes.MAKE_TRUST_URL) {
        this.naviService.setComponentToShow(msg.msgData.componentToShow);
        const isNaviExpanded = this.storageService.getItem(StorageKeys.IS_NAVI_EXPANDED);
        if (msg.msgData?.componentToShow === 'Resources') {
          this.storageService.removeItem(StorageKeys.Product);
          this.storageService.removeItem(StorageKeys.CONVERSATION);
          this.naviService.setResourceID(msg.msgData.resource_id);
        }
        if (msg.msgData?.componentToShow === 'Chat' && msg.msgData.component !== 'my-products') {
          this.storageService.removeItem(StorageKeys.Product);
          this.storageService.removeItem(StorageKeys.CONVERSATION);
          this.naviService.setConversationID(msg.msgData?.conversation_id);
        }
        this.naviService.setNaviExpand(isNaviExpanded ? isNaviExpanded : msg.msgData?.isNaviExpanded);
        this.naviService.makeTrustedUrl();
        this.showNaviSpinner = false;
      }
      if (msg.msgData && msg.msgType === MessageTypes.NAVI_CONTAINER_STATE) {
        this.showDockedNavi = true;
        this.naviService.setNaviExpand(msg.msgData?.naviContainerState === 'EXPAND');
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, msg.msgData?.naviContainerState === 'EXPAND');
        this.naviService.setNewWithNavi(!msg.msgData?.product);
        this.product = msg.msgData?.product;
        this.isFileImported = msg.msgData.importFilePopup;
        this.naviService.setResourceID(msg.msgData.resource_id);
        this.naviService.setConversationID(msg.msgData?.conversation_id);
        this.storageService.saveItem(StorageKeys.IS_NAVI_OPENED, true);
        this.naviService.makeTrustedUrl();
      }
      if (msg.msgData && msg.msgType === MessageTypes.NAVI_CONTAINER_WITH_HISTORY_TAB_IN_RESOURCE) {
        this.showDockedNavi = true;
        this.naviService.setNaviExpand(msg.msgData?.naviContainerState === 'EXPAND');
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, msg.msgData?.naviContainerState === 'EXPAND');
        this.naviService.setComponentToShow(msg.msgData.componentToShow);
        this.naviService.setImportPopupToShow(msg.msgData.importFilePopupToShow);
        this.storageService.saveItem(StorageKeys.IS_NAVI_OPENED, true);
        this.naviService.makeTrustedUrl();
      }
      if (msg.msgType === MessageTypes.CLOSE_NAVI) {
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
        this.showDockedNavi = false;
        this.naviService.setNaviExpand(false);
        this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
      }
    });

    window.addEventListener('message', (event) => this.onNaviEvent(event, this), false);
    this.authApiService.user.subscribe(x => this.user = x);
    // sets an idle timeout of seconds, for testing purposes.
    idle.setIdle(eval(environment.XNODE_IDLE_TIMEOUT_PERIOD_SECONDS));
    // sets a timeout period of environment.XNODE_IDLE_TIMEOUT_PERIOD_SECONDS seconds. after environment.XNODE_IDLE_TIMEOUT_PERIOD_SECONDS seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(environment.XNODE_TIMEOUT_PERIOD_SECONDS);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      console.log(this.idleState);
      if (this.storageService.getItem(StorageKeys.CurrentUser)) {
        this.showInactiveTimeoutPopup = true;
      }
      // this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'
      this.inactiveTimeoutCounter = countdown;
      console.log(this.idleState);
    });

    // sets the ping interval to 50 seconds
    keepalive.interval(50);
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.authApiService.getIsLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch()
        this.timedOut = false;
      } else {
        idle.stop();
      }
    })

    if (this.currentUser) {
      this.currentUser.accessToken = this.storageService.getItem(StorageKeys.ACCESS_TOKEN);
      this.currentUser.refreshToken = this.storageService.getItem(StorageKeys.REFRESH_TOKEN);
      this.authApiService.userSubject.next(this.currentUser)
      this.authApiService.setIsLoggedIn(true)
      this.authApiService.startRefreshTokenTimer();
    }
  }

  onNaviEvent(event: any, parent: any) {
    if (!environment.naviAppUrl.includes(event.origin)) { return; }
    switch (event.data) {
      case "NAVI_USET_ACTIVE_EVENT":
        parent.reset()
        break;
    }
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  navigateToHome(): void {
    this.messagingService.sendMessage({
      msgType: MessageTypes.PRODUCT_CONTEXT,
      msgData: false,
    });
    this.utilsService.showLimitReachedPopup(false);
    this.utilsService.showProductStatusPopup(false);
    this.showDockedNavi = true;
    this.naviService.setNaviExpand(false);
    this.product = undefined;
    localStorage.removeItem('has_insights')
    localStorage.removeItem('record_id')
    localStorage.removeItem('app_name')
    this.storageService.removeItem(StorageKeys.Product);
    this.naviService.setComponentToShow('Tasks');
    this.naviService.makeTrustedUrl();
    this.naviService.setMainComponent('my-products');
    this.router.navigate(['/my-products']);
  }

  enableDockedNavi(): void {
    this.naviService.setNaviExpand(false);
    this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    this.naviService.makeTrustedUrl();
  }

  async changeTheme(event: any) {
    this.themeService.changeColorTheme(event);
  }

  ngOnInit(): void {
    this.storageService.saveItem(StorageKeys.IS_NAVI_OPENED, true);
    const isNaviExpanded: any = this.storageService.getItem(StorageKeys.IS_NAVI_EXPANDED);
    if (isNaviExpanded) {
      this.naviService.setNaviExpand(isNaviExpanded);
    };
    this.showDockedNavi = true;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    window.addEventListener('message', this.receiveMessage.bind(this), false);
    this.handleTheme();
    this.naviService.changeIframeDetail().subscribe((response: any) => {
      if (response) {
        this.iframeUrl = response?.iframeUrl;
        this.showDockedNavi = response?.showDockedNavi;
        this.isNaviExpanded = response.isNaviExpanded;
      }
    });
    //is navi expanded or not
    this.naviService.changeNaviExpand().subscribe((response: any) => {
      this.isNaviExpanded = response;
    });
  }

  logout(): void {
    const naviFrame = document.getElementById('naviFrame')
    if (naviFrame) {
      const iWindow = (<HTMLIFrameElement>naviFrame).contentWindow;
      iWindow?.postMessage({ message: 'logout' }, environment.naviAppUrl);
    } else {
      this.logoutFromTheApp()
    }
  }

  logoutFromTheApp(): void {
    this.showInactiveTimeoutPopup = false;
    this.timedOut = false;
    this.idle.stop();
    this.auditService.postAudit('LOGGED_OUT', 1, 'SUCCESS', 'user-audit');
    this.utilsService.showProductStatusPopup(false);
    this.utilsService.showLimitReachedPopup(false);
    this.authApiService.logout();
    setTimeout(() => {
      localStorage.clear();
      this.authApiService.setUser(false);
      this.router.navigate(['/']);
    }, 1000);
  }

  closeNavi(): void {
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('');
    this.product = undefined;
    this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    this.showDockedNavi = false;
    localStorage.removeItem('has_insights');
    localStorage.removeItem('IS_NAVI_OPENED');
    localStorage.removeItem('app_name');
    this.naviService.setNaviExpand(false);
    this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED);
    this.naviService.makeTrustedUrl();
  }

  receiveMessage(event: MessageEvent) {
    if (event.origin + '/' !== environment.naviAppUrl.split('?')[0]) return
    if (event?.data?.message === 'close-event') {
      this.closeNavi();
    }
    if (event.data.message === 'triggerCustomEvent') {
      this.showDockedNavi = false;
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    }
    if (event.data.message === 'close-docked-navi') {
      this.showDockedNavi = false;
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    }
    if (event.data.message === 'close-event') {
      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('');
      this.product = undefined;
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
      this.showDockedNavi = false;
      localStorage.removeItem('has_insights');
      localStorage.removeItem('IS_NAVI_OPENED');
      localStorage.removeItem('app_name');
      this.naviService.setNaviExpand(false);
      this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
      this.naviService.makeTrustedUrl()
    }
    if (event.data.message === 'expand-navi') {
      this.naviService.setNaviExpand(true);
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
    }
    if (event.data.message === 'logout') {
      this.logoutFromTheApp()
    }
    if (event.data.message === 'contract-navi') {
      this.naviService.setNaviExpand(false);
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    }
    if (event.data.message === 'triggerProductPopup') {
      this.content = event.data.data;
      let data = { popup: true, data: this.content };
      this.utilsService.toggleProductAlertPopup(data);
    }
    if (event.data.message === 'view-summary-popup') {
      this.conversation_id = event.data.conversation_id;
      this.getConversation();
      this.utilsService.loadSpinner(true);
    }
    if (event.data.message === 'triggerRouteToMyProducts') {
      const itemId = event.data.id;
      localStorage.setItem('record_id', itemId);
      this.utilsService.saveProductId(itemId);
      const metaData = localStorage.getItem('meta_data');
      if (metaData) {
        let templates = JSON.parse(metaData);
        const product = templates?.filter((obj: any) => {
          return obj.id === itemId;
        })[0];
        localStorage.setItem('app_name', product.title);
        localStorage.setItem('product_url', product.url && product.url !== '' ? product.url : '');
        localStorage.setItem('product', JSON.stringify(product));
      }
      const newUrl = this.xnodeAppUrl + '#/dashboard';
      this.showDockedNavi = false;
      this.naviService.setNaviExpand(false);
      window.location.href = newUrl;
    }
    if (event.data.message === 'expand-navi') {
      this.naviService.setNaviExpand(true);
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
    }
    if (event.data.message === 'contract-navi') {
      this.naviService.setNaviExpand(false);
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    }
    if (event?.data?.message === 'change-app' && event.data.product) {
      const product = event.data.product;
      this.storageService.saveItem(StorageKeys.Product, product);
      this.messagingService.sendMessage({ msgType: MessageTypes.PRODUCT_CONTEXT, msgData: true });
      if (this.router.url === '/overview') {
        location.reload()
      } else
        this.router.navigate(['/overview']);
    } else
      if (event?.data?.message === 'change-app' && !event.data.product) {
        this.storageService.removeItem(StorageKeys.Product);
        this.messagingService.sendMessage({ msgType: MessageTypes.PRODUCT_CONTEXT, msgData: false });
        this.router.navigate(['/my-products']);
      }
      else if (event?.data?.message === 'change-product-context') {
        const conversationDetails = event.data.conversationDetails;
        let product = localStorage.getItem('meta_data');
        if (product) {
          let allProducts = JSON.parse(product);
          product = allProducts.find((p: any) => p.id == conversationDetails.productId);
        }
        this.storageService.saveItem(StorageKeys.Product, product);
        this.messagingService.sendMessage({ msgType: MessageTypes.PRODUCT_CONTEXT, msgData: true });
        this.router.navigate(['/dashboard']);
        this.showDockedNavi = false;
        this.naviService.setNaviExpand(false);
      }
    if (event.data.message === 'import-file-popup') {
      this.conversation_id = event.data?.conversation_id;
      this.showImportFilePopup = true;
      localStorage.setItem('conversationId', event.data.id)
    }
    if (event?.data?.message === 'clear_deep_link_storage') {
      this.storageService.removeItem(event?.data?.clearStorage);
    }
  }

  async handleTheme(): Promise<void> {
    this.colorPallet = themeing.theme;
    await this.changeTheme(this.colorPallet[6]);
    this.handleUser();
  }

  handleUser(): void {
    if (this.currentUser) {
      if (this.currentUser.role_name === 'Xnode Admin') {
        this.router.navigate(['/admin/user-invitation']);
      } else {
        this.router.navigate(['/my-products']);
      }
      this.preparingData();
      this.handleBotIcon();
      this.openNavi();
      this.getAllUsers();
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
    this.utilsService.getMeProductDetails.subscribe((data: any) => {
      if (data && data?.email) {
      }
    });
    this.utilsService.getMeSummaryPopupStatus.subscribe((data: any) => {
      if (data) {
        this.showSummaryPopup = true;
      }
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
        let urlObj = new URL(window.location.href);
        let hash = urlObj.hash;
        let [path, queryString] = hash.substr(1).split('?')
        this.router.navigateByUrl(path);
      } else {
        this.router.navigateByUrl(previousUrl);
      }
    }
  }

  preparingData() {
    this.utilsService.getMeToastObject.subscribe((event: any) => {
      this.messageService.add(event);
    });
    this.utilsService.handleLimitReachedPopup.pipe(debounce(() => interval(1000)))
      .subscribe((event: any) => {
        this.showLimitReachedPopup = event;
        if (event) {
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

  getMeTotalOnboardedApps(): void {
    this.naviApiService.getTotalOnboardedApps(this.currentUser?.email).then(
      (response: any) => {
        if (response?.status === 200) {
          localStorage.setItem('total_apps_onboarded', response.data.total_apps_onboarded);
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail });
        }
      }).catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
        this.utilsService.loadSpinner(true);
      });
  }

  loadIframeUrl(): void {
    if (window?.addEventListener) {
      window?.addEventListener('message', (event) => {
        if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
          return;
        }
        if (event.data.message === 'triggerCustomEvent') {
          this.showDockedNavi = false;
          this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
        }
        if (event.data.message === 'close-docked-navi') {
          this.showDockedNavi = false;
          this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
        }
        if (event.data.message === 'close-event') {
          this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('');
          this.product = undefined;
          this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
          this.showDockedNavi = false;
          localStorage.removeItem('has_insights');
          localStorage.removeItem('IS_NAVI_OPENED');
          localStorage.removeItem('app_name');
          this.naviService.setNaviExpand(false);
          this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
          this.naviService.makeTrustedUrl()
        }
        if (event.data.message === 'expand-navi') {
          this.naviService.setNaviExpand(true);
          this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
        }
        if (event.data.message === 'contract-navi') {
          this.naviService.setNaviExpand(false);
          this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
        }
        if (event.data.message === 'triggerProductPopup') {
          this.content = event.data.data;
          let data = { popup: true, data: this.content };
          this.utilsService.toggleProductAlertPopup(data);
        }
        if (event.data.message === 'view-summary-popup') {
          this.conversation_id = event.data.conversation_id;
          this.getConversation();
          this.utilsService.loadSpinner(true);
        }
        // if (event.data.message === 'change-app') {
        //   this.storageService.saveItem(StorageKeys.Product, event.data.data);
        //   this.utilsService.saveProductId(event.data.id);
        //   this.router.navigate(['/overview']);
        //   this.utilsService.productContext(true);
        // }
        if (event.data.message === 'triggerRouteToDashboard') {
          const itemId = event.data.id;
          localStorage.setItem('record_id', itemId);
          this.utilsService.saveProductId(itemId);
          const metaData = localStorage.getItem('meta_data');
          if (metaData) {
            let templates = JSON.parse(metaData);
            const product = templates?.filter((obj: any) => {
              return obj.id === itemId;
            })[0];
            localStorage.setItem('app_name', product.title);
            localStorage.setItem(
              'product_url',
              product.url && product.url !== '' ? product.url : ''
            );
            localStorage.setItem('product', JSON.stringify(product));
          }
          const newUrl = this.xnodeAppUrl + '#/dashboard';
          this.showDockedNavi = false;
          this.naviService.setNaviExpand(false);
          window.location.href = newUrl;
        }
      });
    }

    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    if (window?.addEventListener) {
      iframe?.addEventListener('load', () => {
        const contentWindow = iframe.contentWindow;
        if (contentWindow) {
          window.addEventListener('message', (event) => {
            if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
              return;
            }
            if (event.data?.message) {
              switch (event.data.message) {
                case 'triggerCustomEvent':
                  this.showDockedNavi = false;
                  this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false);
                  break;
                case 'close-docked-navi':
                  this.showDockedNavi = false;
                  this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false);
                  break;
                case 'expand-navi':
                  this.naviService.setNaviExpand(true);
                  this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
                  break;
                case 'contract-navi':
                  this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false);
                  break;
              }
            }
          });
        }
      });
    }
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

  openNavi() {
    this.showNaviSpinner = true;
    setTimeout(() => {
      this.showNaviSpinner = false;
      this.prepareDataOnOpeningNavi()
    }, 1000);
  }

  prepareDataOnOpeningNavi(): void {
    this.naviService.setComponentToShow('Tasks');
    const product: any = this.storageService.getItem(StorageKeys.Product)
    if (product)
      this.naviService.setComponentToShow('Chat');
    this.naviService.setNewWithNavi(false);
    this.storageService.saveItem(StorageKeys.IS_NAVI_OPENED, true);
    this.naviService.makeTrustedUrl();
  }

  getAllUsers() {
    let accountId = this.currentUser.account_id
    if (accountId) {
      let params = { account_id: accountId };
      this.authApiService.getUsersByAccountId(params).then((response: any) => {
        response.data.forEach((element: any) => { element.name = element.first_name + ' ' + element.last_name });
        this.usersList = response.data;
      })
    }
  }

  isUserExists() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser;
  }

  toggleSideWindow() {
    this.showDockedNavi = !this.showDockedNavi;
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

  closeSideWindow() {
    this.showDockedNavi = false;
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
        username: this.currentUser?.first_name + ' ' + this.currentUser?.last_name,
      }
    };
    this.notifyApi.emailNotify(body).then((res: any) => {
      if (res?.data?.detail) {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.detail });
      }
    }).catch((err: any) => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err?.response?.data?.detail });
    });
  }

  getConversation(): void {
    this.conversationHubService.getConversations('?id=' + this.conversation_id + '&fieldsRequired=id,title,conversationType,content').then((res: any) => {
      if (res?.data && res.status === 200) {
        this.convSummary = res.data?.data[0].content.conversation_summary;
        this.showSummaryPopup = true;
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: res.data.message });
      }
      this.utilsService.loadSpinner(false);
    }).catch(((err: any) => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: err });
    }))
    this.utilsService.loadSpinner(false);
  }

}
