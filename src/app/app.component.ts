import { Component, OnInit } from '@angular/core';
import { UtilsService } from './components/services/utils.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
import { NaviService } from './api/navi/navi.service';

@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  access_token!: string;
  showDockedNavi: boolean = true;
  showProductStatusPopup: boolean = false;
  isBotIconVisible: boolean = true;
  isNaviExpanded: boolean = false;
  toastObj: any;
  currentUser: any;
  showLimitReachedPopup?: boolean;
  screenWidth: number;
  screenHeight: number;
  deepLink: boolean = false;
  colorPallet: any;
  product: any;
  newWithNavi: boolean = false;
  componentToShow: string = 'Tasks';
  usersList: any;
  showImportFilePopup: boolean = false;
  isFileImported: boolean = false;
  showSummaryPopup: boolean = false;
  convSummary?: OverallSummary;
  conversation_id: any;
  conversationDetails: any;
  naviData!: NaviData;
  conversationId?: string;
  resource_id: any;
  showInactiveTimeoutPopup?: boolean;
  inactiveTimeoutCounter?: number;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = undefined;
  user?: User | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
    private naviService: NaviService
  ) {
    this.checkAntiClickJacking()
    let winUrl = this.authApiService.getDeeplinkURL()
      ? this.authApiService.getDeeplinkURL()
      : window.location.href;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    if (!this.authApiService.isUserLoggedIn()) {
      this.authApiService.setDeeplinkURL(winUrl);
    }
    if (
      winUrl.includes('template_id') ||
      winUrl.includes('template_type') ||
      winUrl.includes('crId') ||
      winUrl.includes('versionId') ||
      winUrl.includes('version_id') ||
      winUrl.includes('product_id') ||
      winUrl.includes('naviURL')
    ) {
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
      this.newWithNavi = false;
      if (msg.msgData && msg.msgType === MessageTypes.PRODUCT_SELECTED) {
        this.naviData = {
          ...this.naviData,
          componentToShow: 'Chat',
          is_navi_expanded: false,
          toggleConversationPanel: false,
          product: {
            id: msg.msgData.product?.id,
            title: msg.msgData.product?.title,
          },
          conversationDetails: msg.msgData.conversationDetails,
        };
        this.storageService.saveItem(StorageKeys.Product, msg.msgData.product);
        this.storageService.saveItem(
          StorageKeys.CONVERSATION_DETAILS,
          msg.msgData.conversationDetails
        );
      }
      if (msg.msgData && msg.msgType === MessageTypes.REFRESH_TOKEN) {
        this.naviService.makeTrustedUrl();
      }
      if (msg.msgData && msg.msgType === MessageTypes.USER_LIST) {
        this.naviData.users = msg.msgData;
      }
      if (msg.msgData && msg.msgType === MessageTypes.ACCESS_TOKEN) {
        this.access_token = msg.msgData.access_token;
        this.storageService.saveItem(
          StorageKeys.ACCESS_TOKEN,
          msg.msgData.access_token
        );
        if (msg.msgData.from === 'verify-otp') {
          this.defaultNaviData();
        }
      }
      if (msg.msgData && msg.msgType === MessageTypes.VIEW_IN_CHAT) {
        this.isNaviExpanded = msg.msgData.isNaviExpanded;
        this.naviData = {
          ...this.naviData,
          conversationDetails: msg.msgData.conversationDetails,
          componentToShow: 'Chat',
          is_navi_expanded: msg.msgData.isNaviExpanded,
          toggleConversationPanel: msg.msgData.isNaviExpanded,
          new_with_navi: false,
          chat_type: 'old-chat',
        };
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
      }
      if (msg.msgData && msg.msgType === MessageTypes.VIEW_SUMMARY) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData = {
          ...this.naviData,
          conversationDetails: msg.msgData.conversationDetails,
          componentToShow: 'Chat',
          is_navi_expanded: true,
          toggleConversationPanel: true,
          new_with_navi: false,
          chat_type: 'old-chat',
        };
      }
      if (msg.msgData && msg.msgType === MessageTypes.MAKE_TRUST_URL) {
        this.naviService.setComponentToShow(msg.msgData.componentToShow);
        const isNaviExpanded = this.storageService.getItem(
          StorageKeys.IS_NAVI_EXPANDED
        );
        if (msg.msgData?.componentToShow === 'Resources') {
          this.storageService.removeItem(StorageKeys.Product);
          this.storageService.removeItem(StorageKeys.CONVERSATION);
          this.naviService.setResourceID(msg.msgData.resource_id);
        }
        if (
          msg.msgData?.componentToShow === 'Chat' &&
          msg.msgData.component !== 'my-products'
        ) {
          this.storageService.removeItem(StorageKeys.Product);
          this.storageService.removeItem(StorageKeys.CONVERSATION);
          this.naviService.setConversationID(msg.msgData?.conversation_id);
        }
        this.isNaviExpanded = isNaviExpanded
          ? isNaviExpanded
          : msg.msgData?.isNaviExpanded;
        console.log('5');
      }
      if (msg.msgData && msg.msgType === MessageTypes.NEW_WITH_NAVI) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData.is_navi_expanded = true;
        this.naviData.toggleConversationPanel = true;
        this.naviData.componentToShow = 'Chat';
        this.naviData.new_with_navi = true;
        this.naviData.chat_type = 'new-chat';
        this.naviData.conversationDetails = undefined;
      }
      if (msg.msgData && msg.msgType === MessageTypes.NAVI_CONTAINER_STATE) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.isFileImported = msg.msgData.importFilePopup;
        this.resource_id = msg.msgData.resource_id;
        this.conversationId = msg.msgData.conversation_id;
        this.componentToShow = 'Chat';
      }
      if (msg.msgData && msg.msgType === MessageTypes.START_RESOURCE_NEW_CHAT) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData.is_navi_expanded = true;
        this.naviData.toggleConversationPanel = true;
        this.naviData.componentToShow = 'Chat';
        this.naviData.new_with_navi = true;
        this.naviData.chat_type = 'new-chat';
        this.naviData.resource_id = msg.msgData.resource_id;
        this.naviData.conversationDetails = undefined;
      }
      if (msg.msgData && msg.msgType === MessageTypes.IMPORT_RESOURCE) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData = {
          ...this.naviData,
          is_navi_expanded: true,
          componentToShow: 'Resources',
          import_event: msg?.msgData.import_event,
          toggleConversationPanel: true,
          new_with_navi: false,
        };
      }
      if (msg.msgData && msg.msgType === MessageTypes.THREAD_DETAILS) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData = {
          ...this.naviData,
          is_navi_expanded: true,
          componentToShow: 'Threads',
          toggleConversationPanel: true,
          new_with_navi: false,
          threadDetails: msg.msgData.threadDetails,
        };
      }
      if (msg.msgData && msg.msgType === MessageTypes.COMMENT_DETAILS) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData = {
          ...this.naviData,
          is_navi_expanded: true,
          componentToShow: 'Comments',
          toggleConversationPanel: true,
          new_with_navi: false,
          commentDetails: msg.msgData.commentDetails,
        };
      }
      if (msg.msgData && msg.msgType === MessageTypes.TASK_DETAILS) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData = {
          ...this.naviData,
          is_navi_expanded: true,
          componentToShow: 'Tasks',
          toggleConversationPanel: true,
          new_with_navi: false,
          taskDetails: msg.msgData.taskDetails,
        };
      }
      if (msg.msgData && msg.msgType === MessageTypes.RESOURCE_DETAILS) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData = {
          ...this.naviData,
          is_navi_expanded: true,
          componentToShow: 'Resources',
          toggleConversationPanel: true,
          new_with_navi: false,
          resourceDetails: msg.msgData.resourceDetails,
        };
      }
      if (msg.msgData && msg.msgType === MessageTypes.VIEW_RESOURCE) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData = {
          ...this.naviData,
          is_navi_expanded: true,
          conversationDetails: undefined,
          componentToShow: 'Resources',
          toggleConversationPanel: true,
          new_with_navi: false,
          resource_id: msg.msgData.resource_id,
        };
      }
      if (msg.msgData && msg.msgType === MessageTypes.ACTIVITY_CLICK) {
        this.showDockedNavi = true;
        this.isNaviExpanded = true;
        this.naviData = {
          ...this.naviData,
          is_navi_expanded: true,
          conversationDetails: undefined,
          componentToShow: msg.msgData.componentToShow,
          toggleConversationPanel: true,
          new_with_navi: false,
        };
      }
      if (
        msg.msgData &&
        msg.msgType === MessageTypes.NAVI_CONTAINER_WITH_HISTORY_TAB_IN_RESOURCE
      ) {
        this.showDockedNavi = true;
        this.naviService.setNaviExpand(
          msg.msgData?.naviContainerState === 'EXPAND'
        );
        this.storageService.saveItem(
          StorageKeys.IS_NAVI_EXPANDED,
          msg.msgData?.naviContainerState === 'EXPAND'
        );
        this.naviService.setComponentToShow(msg.msgData.componentToShow);
        this.naviService.setImportPopupToShow(
          msg.msgData.importFilePopupToShow
        );
        this.storageService.saveItem(StorageKeys.IS_NAVI_OPENED, true);
        this.naviService.makeTrustedUrl();
      }
      if (msg.msgType === MessageTypes.CLOSE_NAVI) {
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false);
        this.showDockedNavi = false;
        this.naviService.setNaviExpand(false);
        this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED);
      }
    });

    this.authApiService.user.subscribe((x: any) => (this.user = x));

    // sets an idle timeout of seconds, for testing purposes.
    idle.setIdle(eval(environment.XNODE_IDLE_TIMEOUT_PERIOD_SECONDS));
    // sets a timeout period of environment.XNODE_IDLE_TIMEOUT_PERIOD_SECONDS seconds. after environment.XNODE_IDLE_TIMEOUT_PERIOD_SECONDS seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(environment.XNODE_TIMEOUT_PERIOD_SECONDS);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      console.log(this.idleState);
      if (this.storageService.getItem(StorageKeys.CurrentUser)) {
        this.showInactiveTimeoutPopup = true;
      }
    });

    idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      this.inactiveTimeoutCounter = countdown;
      console.log(this.idleState);
    });

    // sets the ping interval to 50 seconds
    keepalive.interval(50);
    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.authApiService.getIsLoggedIn().subscribe((userLoggedIn: any) => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });

    if (this.currentUser) {
      this.currentUser.accessToken = this.storageService.getItem(
        StorageKeys.ACCESS_TOKEN
      );
      this.currentUser.refreshToken = this.storageService.getItem(
        StorageKeys.REFRESH_TOKEN
      );
      this.authApiService.userSubject.next(this.currentUser);
      this.authApiService.setIsLoggedIn(true);
      this.authApiService.startRefreshTokenTimer();
    }
  }

  checkAntiClickJacking() {
    if (self !== top) {
      window.location.href = environment.xnodeAppUrl;
    }
  }

  childCall(event: NaviEventParams) {
    console.log('From Library: ', event);
    switch (event.message) {
      case 'select-conversation':
        this.naviData = {
          ...this.naviData,
          componentToShow: event.componentToShow,
          conversationDetails: event.value,
          chat_type: event.chat_type,
          banner: event.banner,
        };
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        break;
      case 'view-summary':
        this.naviData = {
          ...this.naviData,
          componentToShow: event.componentToShow,
          conversationDetails: event.value,
          chat_type: event.chat_type,
          banner: event.banner,
        };
        if (this.naviData)
          this.conversation_id = this.naviData.conversationDetails?.id;
        this.getConversation();
        this.utilsService.loadSpinner(true);
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        break;
      case 'close-navi':
        this.showDockedNavi = false;
        this.isNaviExpanded = false;
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
        break;
      case 'expand-navi':
        this.isNaviExpanded = event.is_navi_expanded;
        this.naviData = { ... this.naviData, is_navi_expanded: event.is_navi_expanded, toggleConversationPanel: event.is_navi_expanded, chat_type: event.chat_type };
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
        break;
      case 'change-product':
        this.storageService.saveItem(StorageKeys.Product, event.product);
        this.utilsService.saveProductId(event.product.id);
        this.messagingService.sendMessage({
          msgType: MessageTypes.PRODUCT_CONTEXT,
          msgData: true,
        });
        this.utilsService.productContext(true);
        this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
        this.router.navigate(['/overview']);
        break;
      case 'new-chat':
        this.isNaviExpanded = event.is_navi_expanded;
        this.naviData = {
          ...this.naviData,
          componentToShow: event.componentToShow,
          new_with_navi: event.new_with_navi,
          chat_type: event.chat_type,
          is_navi_expanded: event.is_navi_expanded,
          toggleConversationPanel: event.toggleConversationPanel,
          conversationDetails: undefined,
        };
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
    localStorage.removeItem('has_insights');
    localStorage.removeItem('record_id');
    localStorage.removeItem('app_name');
    this.storageService.removeItem(StorageKeys.Product);
    this.showDockedNavi = true;
    this.isNaviExpanded = false;
    this.naviData = {
      ...this.naviData,
      conversationDetails: undefined,
      is_navi_expanded: false,
      componentToShow: 'Tasks',
      toggleConversationPanel: false,
      product: undefined,
    };
    this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
    this.router.navigate(['/my-products']);
  }

  enableDockedNavi(): void {
    this.naviService.setNaviExpand(false);
    this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false);
    this.naviData = {
      ...this.naviData,
      is_navi_expanded: false,
      toggleConversationPanel: false,
    };
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
        account_id: '',
      },
      access_token: '',
      toggleConversationPanel: false,
      showDockedNavi: false,
    };
    this.isNaviExpanded = this.naviData.is_navi_expanded;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.handleTheme();
    if (!this.naviData.conversationDetails) this.defaultNaviData();
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
        account_id: '',
      },
      access_token: '',
      toggleConversationPanel: false,
      showDockedNavi: false,
    };
    if (user) {
      this.naviData.user.first_name = user?.first_name;
      this.naviData.user.last_name = user.last_name;
      this.naviData.user.email = user.email;
      this.naviData.user.user_id = user.user_id;
      this.naviData.user.account_id = user.account_id;
    }
    if (token) this.naviData.access_token = token;
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
        this.defaultNaviData();
        this.authApiService.setUser(false);
        this.authApiService.stopRefreshTokenTimer();
        this.authApiService.userSubject.next(null);
        this.router.navigate(['/login']);
      }
    });
  }

  async handleTheme(): Promise<void> {
    this.colorPallet = themeing.theme;
    await this.changeTheme(this.colorPallet[6]);
    this.handleUser();
  }

  handleUser(): void {
    const searchParams = new URLSearchParams(window.location.search);
    const entity = searchParams.get('entity');
    if (entity) {
      if (!this.currentUser)
        this.storageService.saveItem(StorageKeys.REDIRECT_PATH, { pathname: window.location.pathname, params: window.location.search })
      return
    }
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
      if (!window.location.hash.includes('/reset-password?email')) {
        localStorage.clear();
      }
      this.utilsService.getMeToastObject.subscribe((event: any) => {
        this.messageService.add(event);
      });
    }
    if (!window.location.hash.includes('/reset-password?email'))
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
        let [path, queryString] = hash.substr(1).split('?');
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
    this.utilsService.handleLimitReachedPopup
      .pipe(debounce(() => interval(1000)))
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
    this.naviApiService
      .getTotalOnboardedApps(this.currentUser?.email)
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

  prepareNaviData(): void {
    const access_token = this.storageService.getItem(StorageKeys.ACCESS_TOKEN);
    const currentUser: any = this.storageService.getItem(
      StorageKeys.CurrentUser
    );
    const product: any = this.storageService.getItem(StorageKeys.Product);
    const conversationDetails: any = this.storageService.getItem(
      StorageKeys.CONVERSATION_DETAILS
    );
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
          title: product.title,
        };
      if (conversationDetails && this.naviData)
        this.naviData.conversationDetails = conversationDetails;
      if (access_token) this.naviData.access_token = access_token as string;
      this.storageService.saveItem(StorageKeys.NAVI_DATA, this.naviData);
    }
  }

  openNavi() {
    this.prepareDataOnOpeningNavi();
  }

  prepareDataOnOpeningNavi(): void {
    this.naviService.setComponentToShow('Tasks');
    this.showDockedNavi = true;
    const product: any = this.storageService.getItem(StorageKeys.Product);
    if (product) this.componentToShow = 'Chat';
    this.newWithNavi = false;
    this.prepareNaviData();
  }

  getAllUsers() {
    let accountId = this.currentUser.account_id;
    if (accountId) {
      let params = { account_id: accountId };
      this.authApiService.getUsersByAccountId(params).then((response: any) => {
        response.data.forEach((element: any) => {
          element.name = element.first_name + ' ' + element.last_name;
        });
        console.log('response', response);

        this.usersList = response.data;
        this.naviData.users = response.data;
      });
    }
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
    this.conversationHubService
      .getConversations(
        '?id=' +
        this.conversation_id +
        '&fieldsRequired=id,title,conversationType,content'
      )
      .then((res: any) => {
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
      })
      .catch((err: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      });
    this.utilsService.loadSpinner(false);
  }
}
