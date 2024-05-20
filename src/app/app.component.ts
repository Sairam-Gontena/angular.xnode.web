import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { NaviData } from './models/interfaces/navi-data';
import { NaviEventParams } from './models/interfaces/navi-event-params';

@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})

export class AppComponent implements OnInit, AfterViewInit {
  access_token!: string;
  showDockedNavi: boolean = true;
  isXnodeLoaded: boolean = false;
  showProductStatusPopup: boolean = false;
  isBotIconVisible: boolean = true;
  email: String = '';
  id: String = '';
  loading: boolean = true;
  isNaviExpanded: boolean = false;
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
  newWithNavi: boolean = false;
  componentToShow: string = 'Tasks';
  mainComponent: string = '';
  showNaviSpinner: boolean = true;
  importFilePopupToShow: boolean = false;
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
  conversationDetails: any;
  tempObj: any = {};
  naviData!: NaviData;
  conversationId?: string;
  resource_id: any;
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
    private keepalive: Keepalive) {
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
        this.isNaviExpanded = false;
      }
    });
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      this.importFilePopupToShow = false;
      this.newWithNavi = false;
      if (msg.msgData && msg.msgType === MessageTypes.PRODUCT_SELECTED) {
        this.naviData = {
          ...this.naviData,
          componentToShow: 'Chat',
          is_navi_expanded: false,
          toggleConversationPanel: false,
          product: {
            id: msg.msgData.product?.id,
            title: msg.msgData.product?.title
          },
          conversationDetails: msg.msgData.conversationDetails
        }
        this.storageService.saveItem(StorageKeys.Product, msg.msgData.product);
        this.storageService.saveItem(StorageKeys.CONVERSATION_DETAILS, msg.msgData.conversationDetails);
      }
      if (msg.msgData && msg.msgType === MessageTypes.ACCESS_TOKEN) {
        this.access_token = msg.msgData.access_token;
        this.storageService.saveItem(StorageKeys.ACCESS_TOKEN, msg.msgData.access_token);
        if (msg.msgData.from === 'verify-otp') {
          this.defaultNaviData()
        }
      }
      if (msg.msgData && msg.msgType === MessageTypes.VIEW_IN_CHAT) {
        this.naviData.is_navi_expanded = false;
        this.naviData.conversationDetails = msg.msgData.conversationDetails;
        this.naviData.componentToShow = 'Chat';
      }
      if (msg.msgData && msg.msgType === MessageTypes.VIEW_SUMMARY) {
        this.naviData = { ...this.naviData, conversationDetails: msg.msgData.conversationDetails, componentToShow: 'Chat', is_navi_expanded: true, toggleConversationPanel: true, new_with_navi: false, chat_type: 'old-chat' }
      }
      if (msg.msgData && msg.msgType === MessageTypes.MAKE_TRUST_URL) {
        this.componentToShow = msg.msgData?.componentToShow;
        const isNaviExpanded = this.storageService.getItem(StorageKeys.IS_NAVI_EXPANDED);
        if (msg.msgData?.componentToShow === 'Resources') {
          this.storageService.removeItem(StorageKeys.Product);
          this.storageService.removeItem(StorageKeys.CONVERSATION);
          this.resource_id = msg.msgData.resource_id;
        }
        if (msg.msgData?.componentToShow === 'Chat' && msg.msgData.component !== 'my-products') {
          this.storageService.removeItem(StorageKeys.Product);
          this.storageService.removeItem(StorageKeys.CONVERSATION);
          this.conversationId = msg.msgData?.conversation_id;
        }
        this.isNaviExpanded = isNaviExpanded ? isNaviExpanded : msg.msgData?.isNaviExpanded;
        console.log('5');
        this.showNaviSpinner = false;
      }
      if (msg.msgData && msg.msgType === MessageTypes.NEW_WITH_NAVI) {
        this.showDockedNavi = true
        this.isNaviExpanded = true;
        this.naviData.is_navi_expanded = true;
        this.naviData.toggleConversationPanel = true;
        this.naviData.componentToShow = 'Chat';
        this.naviData.new_with_navi = true;
        this.naviData.chat_type = 'new-chat';
        this.naviData.conversationDetails = undefined;
      }
      if (msg.msgData && msg.msgType === MessageTypes.NAVI_CONTAINER_STATE) {
        this.showDockedNavi = true
        this.isNaviExpanded = msg.msgData?.naviContainerState === 'EXPAND';
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, msg.msgData?.naviContainerState === 'EXPAND')
        this.newWithNavi = !msg.msgData?.product;
        this.product = msg.msgData?.product;
        this.isFileImported = msg.msgData.importFilePopup;
        this.resource_id = msg.msgData.resource_id
        this.conversationId = msg.msgData.conversation_id;
        this.componentToShow = 'Chat';
        console.log('6');
      }
      if (msg.msgData && msg.msgType === MessageTypes.IMPORT_RESOURCE) {
        this.showDockedNavi = true
        this.isNaviExpanded = true
        this.naviData = { ...this.naviData, is_navi_expanded: true, componentToShow: "Chat", import_event: msg?.msgData.import_event, toggleConversationPanel: true, new_with_navi: true }
      }
      if (msg.msgData && msg.msgType === MessageTypes.VIEW_RESOURCE) {
        this.showDockedNavi = true
        this.isNaviExpanded = true
        this.naviData = { ...this.naviData, is_navi_expanded: true, conversationDetails: undefined, componentToShow: "Resources", import_event: msg?.msgData.import_event, toggleConversationPanel: true, new_with_navi: true, resource_id: msg.msgData.resource_id }
      }
      if (msg.msgType === MessageTypes.CLOSE_NAVI) {
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
        this.showDockedNavi = false;
        this.isNaviExpanded = false;
        this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
      }
    })

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

    idle.onTimeoutWarning.subscribe((countdown: any) => {
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

  childCall(event: NaviEventParams) {
    console.log('From Library: ', event);
    switch (event.message) {
      case 'select-conversation':
        this.naviData = { ... this.naviData, componentToShow: event.componentToShow, conversationDetails: event.value, chat_type: event.chat_type, banner: event.banner }
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        break;
      case 'view-summary':
        this.naviData = { ... this.naviData, componentToShow: event.componentToShow, conversationDetails: event.value, chat_type: event.chat_type, banner: event.banner }
        if (this.naviData)
          this.conversation_id = this.naviData.conversationDetails?.id;
        this.getConversation();
        this.utilsService.loadSpinner(true);
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        break;
      case 'close-navi':
        this.showDockedNavi = false;
        this.isNaviExpanded = false;
        this.naviData = { ... this.naviData, showDockedNavi: false };
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        break;
      case 'expand-navi':
        this.isNaviExpanded = event.is_navi_expanded;
        this.naviData = { ... this.naviData, is_navi_expanded: event.is_navi_expanded, toggleConversationPanel: event.is_navi_expanded, chat_type: event.chat_type };
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        break;
      case 'change-product':
        this.storageService.saveItem(StorageKeys.Product, event.product);
        this.utilsService.saveProductId(event.product.id);
        this.messagingService.sendMessage({ msgType: MessageTypes.PRODUCT_CONTEXT, msgData: true });
        this.utilsService.productContext(true);
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        this.router.navigate(['/overview']);
        break;
      case 'new-chat':
        this.isNaviExpanded = event.is_navi_expanded;
        this.naviData = { ... this.naviData, componentToShow: event.componentToShow, new_with_navi: event.new_with_navi, chat_type: event.chat_type, is_navi_expanded: event.is_navi_expanded, toggleConversationPanel: event.toggleConversationPanel, conversationDetails: undefined };
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        break;
      default:
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
    this.product = undefined;
    localStorage.removeItem('has_insights')
    localStorage.removeItem('record_id')
    localStorage.removeItem('app_name')
    this.storageService.removeItem(StorageKeys.Product);
    this.mainComponent = 'my-products';
    this.showDockedNavi = true;
    this.isNaviExpanded = false;
    this.naviData = { ...this.naviData, conversationDetails: undefined, is_navi_expanded: false, componentToShow: 'Tasks', toggleConversationPanel: false, product: undefined }
    this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
    this.router.navigate(['/my-products']);
  }

  enableDockedNavi(): void {
    this.isNaviExpanded = false;
    this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    this.naviData = { ...this.naviData, is_navi_expanded: false, toggleConversationPanel: false }

  }

  async changeTheme(event: any) {
    this.themeService.changeColorTheme(event);
  }

  ngOnInit(): void {
    console.log('xnode oninit');
    this.naviData = this.storageService.getItem(StorageKeys.NAVI_DATA) ?? {
      componentToShow: 'Tasks',
      is_navi_expanded: false,
      restriction_max_value: 50,
      user: {
        first_name: '',
        last_name: '',
        email: '',
        user_id: '',
        account_id: ''
      },
      access_token: '',
      toggleConversationPanel: false,
      showDockedNavi: false,
    };
    this.isNaviExpanded = this.naviData.is_navi_expanded
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.handleTheme();
    if (!this.naviData.conversationDetails)
      this.defaultNaviData()
  }

  ngAfterViewInit(): void {
    console.log('!@!@!@!@ngAfterViewInit');
    this.isXnodeLoaded = true;
  }

  logout(): void {
    this.auditService.postAudit('LOGGED_OUT', 1, 'SUCCESS', 'user-audit');
    this.logoutFromTheApp();
  }

  defaultNaviData(): void {
    const user: any = this.storageService.getItem(StorageKeys.CurrentUser);
    const token: any = this.storageService.getItem(StorageKeys.ACCESS_TOKEN);
    this.naviData = {
      componentToShow: 'Tasks',
      is_navi_expanded: false,
      restriction_max_value: 50,
      user: {
        first_name: '',
        last_name: '',
        email: '',
        user_id: '',
        account_id: ''
      },
      access_token: '',
      toggleConversationPanel: false,
      showDockedNavi: false,
    }
    if (user) {
      this.naviData.user.first_name = user?.first_name;
      this.naviData.user.last_name = user.last_name;
      this.naviData.user.email = user.email;
      this.naviData.user.user_id = user.user_id;
      this.naviData.user.account_id = user.account_id;
    }
    if (token)
      this.naviData.access_token = token;
    this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
  }

  logoutFromTheApp(): void {
    this.showInactiveTimeoutPopup = false;
    this.timedOut = false;
    this.idle.stop();
    this.utilsService.showProductStatusPopup(false);
    this.utilsService.showLimitReachedPopup(false);
    this.authApiService.logout().then((res: any) => {
      if (res) {
        localStorage.clear();
        this.defaultNaviData()
        this.authApiService.setUser(false);
        this.router.navigate(['/']);
      }
    })
  }

  closeNavi(): void {
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('');
    this.product = undefined;
    this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    this.showDockedNavi = false;
    localStorage.removeItem('has_insights')
    localStorage.removeItem('app_name')
    this.isNaviExpanded = false;
    this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
    console.log('10');
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
      localStorage.removeItem('has_insights')
      localStorage.removeItem('app_name')
      this.isNaviExpanded = false;
      this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
      console.log('11');
    }
    if (event.data.message === 'expand-navi') {
      this.isNaviExpanded = true;
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
    }

    if (event.data.message === 'logout') {
      this.logoutFromTheApp()
    }
    if (event.data.message === 'contract-navi') {
      this.isNaviExpanded = false;
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    }
    if (event.data.message === 'triggerProductPopup') {
      this.content = event.data.data;
      let data = {
        popup: true,
        data: this.content,
      };
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
        localStorage.setItem(
          'product_url',
          product.url && product.url !== '' ? product.url : ''
        );
        localStorage.setItem('product', JSON.stringify(product));
      }
      const newUrl = this.xnodeAppUrl + '#/dashboard';
      this.showDockedNavi = false;
      this.isNaviExpanded = false;
      window.location.href = newUrl;
    }
    if (event.data.message === 'expand-navi') {
      this.isNaviExpanded = true;
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
    }
    if (event.data.message === 'contract-navi') {
      this.isNaviExpanded = false;
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    }
    if (event?.data?.message === 'change-app' && event.data.product) {
      const product = event.data.product;
      this.storageService.saveItem(StorageKeys.Product, product);
      this.messagingService.sendMessage({ msgType: MessageTypes.PRODUCT_CONTEXT, msgData: true });
      location.reload()
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
        this.isNaviExpanded = false;
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
    this.utilsService.getMeSummaryPopupStatus.subscribe((data: any) => {
      if (data) {
        this.showSummaryPopup = true;
      }
    });
    this.openNavi();
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
          localStorage.removeItem('has_insights')
          localStorage.removeItem('app_name')
          this.isNaviExpanded = false;
          this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
          console.log('1');
        }
        if (event.data.message === 'expand-navi') {
          this.isNaviExpanded = true;
          this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
        }
        if (event.data.message === 'contract-navi') {
          this.isNaviExpanded = false;
          this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
        }
        if (event.data.message === 'triggerProductPopup') {
          this.content = event.data.data;
          let data = {
            popup: true,
            data: this.content,
          };
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
          this.isNaviExpanded = false;
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
                  this.isNaviExpanded = true;
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

  makeTrustedUrl(productEmail?: string): void {
    const access_token = this.storageService.getItem(StorageKeys.ACCESS_TOKEN);
    const currentUser: any = this.storageService.getItem(StorageKeys.CurrentUser);
    const product: any = this.storageService.getItem(StorageKeys.Product);
    const conversationDetails: any = this.storageService.getItem(StorageKeys.CONVERSATION_DETAILS);
    if (this.naviData) {
      this.naviData.componentToShow = this.componentToShow;
      this.naviData.toggleConversationPanel = this.isNaviExpanded;
      this.naviData.new_with_navi = false;
      this.naviData.is_navi_expanded = this.isNaviExpanded;
      this.naviData.showDockedNavi = true;
      if (currentUser) {
        this.naviData.user.account_id = currentUser.account_id;
        this.naviData.user.first_name = currentUser.first_name;
        this.naviData.user.last_name = currentUser.last_name;
        this.naviData.user.email = currentUser.email;
        this.naviData.user.user_id = currentUser.user_id;
      }
      if (product)
        this.naviData.product = {
          id: product.id,
          title: product.title
        };
      if (conversationDetails && this.naviData)
        this.naviData.conversationDetails = conversationDetails;
      if (access_token)
        this.naviData.access_token = access_token as string;
      this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData)
    }
  }

  getMeComponent() {
    let comp = '';
    switch (this.router.url) {
      case '/my-products':
      case '/':
        comp = 'my-products';
        break;
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

  openNavi() {
    this.prepareDataOnOpeningNavi()
  }

  prepareDataOnOpeningNavi(): void {
    this.componentToShow = 'Tasks';
    const product: any = this.storageService.getItem(StorageKeys.Product)
    if (product)
      this.componentToShow = 'Chat';
    this.newWithNavi = false;
    this.makeTrustedUrl();
  }

  getAllUsers() {
    let accountId = this.currentUser.account_id
    if (accountId) {
      let params = {
        account_id: accountId
      }
      this.authApiService.getUsersByAccountId(params).then((response: any) => {
        response.data.forEach((element: any) => { element.name = element.first_name + ' ' + element.last_name });
        this.usersList = response.data;
        this.naviData.users = response.data;
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
        username:
          this.currentUser?.first_name + ' ' + this.currentUser?.last_name,
      },
    };
    this.notifyApi
      .emailNotify(body)
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
  getConversation(): void {
    this.conversationHubService.getConversations('?id=' + this.conversation_id + '&fieldsRequired=id,title,conversationType,content').then((res: any) => {
      if (res?.data && res.status === 200) {
        this.convSummary = res.data?.data[0].content.conversation_summary;
        this.convSummary?.incremental_summary.reverse();
        this.showSummaryPopup = true;
      } else {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: res.data.message,
        });
      }
      this.utilsService.loadSpinner(false);
    }).catch(((err: any) => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({
        severity: 'error',
        summary: 'Error',
        detail: err,
      });
    }))
    this.utilsService.loadSpinner(false);
  }
}
