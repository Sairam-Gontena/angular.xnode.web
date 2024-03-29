import { Component, OnInit } from '@angular/core';
import { UtilsService } from './components/services/utils.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuditutilsService } from './api/auditutils.service';
import { NotifyApiService } from './api/notify.service';
import { AuthApiService } from './api/auth.service';
import { debounce, delay } from 'rxjs/operators';
import { interval, of } from 'rxjs';
import { SidePanel } from 'src/models/side-panel.enum';
import { ThemeService } from './theme.service';
import themeing from '../themes/customized-themes.json';
import { SpecUtilsService } from './components/services/spec-utils.service';
import { NaviApiService } from './api/navi-api.service';
import { LocalStorageService } from './components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecificationUtilsService } from './pages/diff-viewer/specificationUtils.service';
import { MessagingService } from './components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { OverallSummary } from 'src/models/view-summary';
import { ConversationHubService } from './api/conversation-hub.service';
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
  newWithNavi: boolean = false;
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
  conversationID: any;
  summaryObject: any;
  xnodeAppUrl: string = environment.xnodeAppUrl;
  conversatonDetails: any

  constructor(
    private domSanitizer: DomSanitizer,
    private router: Router,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private subMenuLayoutUtil: UtilsService,
    private spinner: NgxSpinnerService,
    public auth: AuthApiService,
    private notifyApi: NotifyApiService,
    private themeService: ThemeService,
    private specUtils: SpecUtilsService,
    private naviApiService: NaviApiService,
    private storageService: LocalStorageService,
    private specificationUtils: SpecificationUtilsService,
    private messagingService: MessagingService,
    private conversationHubService: ConversationHubService
  ) {
    let winUrl = window.location.href;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
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
        this.makeTrustedUrl(data.email);
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
      if (msg.msgData && msg.msgType === MessageTypes.MAKE_TRUST_URL) {
        this.openNavi()
      }
    })
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      if (msg.msgData && msg.msgType === MessageTypes.NAVI_CONTAINER_STATE) {
        this.showDockedNavi = true
        this.isNaviExpanded = msg.msgData?.naviContainerState === 'EXPAND';
        this.newWithNavi = !msg.msgData?.product;
        this.product = msg.msgData?.product;
        this.isFileImported = msg.msgData.importFilePopup;
        this.openNavi();
      }
    })
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      if (msg.msgData === 'CLOSE' && msg.msgType === MessageTypes.CLOSE_NAVI) {
        this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
        this.showDockedNavi = false;
        this.isNaviExpanded = false;
        this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
      }
    })
    this.utilsService.getMeSummaryObject.subscribe((data: any) => {
      this.conversatonDetails = data;
      if (data?.summary && Object.keys(data?.summary).length > 0) {
        this.summaryObject = data;
        let isNaviOpened = localStorage.getItem('IS_NAVI_OPENED');
        if (isNaviOpened) {
          window.frames[0].postMessage({
            type: 'Navi_SUMMARY',
            data: data,
            productId: data.productId,
          }, this.targetUrl);
        } else {
          this.isNaviExpanded = true;
          this.openNavi()
          this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, true)
        }
      }
    })
  }

  navigateToHome(): void {
    this.utilsService.showLimitReachedPopup(false);
    this.utilsService.showProductStatusPopup(false);
    this.showDockedNavi = false;
    this.isNaviExpanded = false;
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('');
    this.product = undefined;
    localStorage.removeItem('product');
    localStorage.removeItem('has_insights')
    localStorage.removeItem('IS_NAVI_OPENED')
    localStorage.removeItem('record_id')
    localStorage.removeItem('app_name')
    this.makeTrustedUrl();
    this.router.navigate(['/my-products'])
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

  async changeTheme(event: any) {
    this.themeService.changeColorTheme(event);
  }

  ngOnInit(): void {
    this.storageService.saveItem(StorageKeys.IS_NAVI_OPENED, true);
    const isNaviExpanded: any = this.storageService.getItem(StorageKeys.IS_NAVI_EXPANDED);
    if (isNaviExpanded) {
      this.isNaviExpanded = isNaviExpanded;
    };
    this.showDockedNavi = true;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    window.addEventListener('message', this.receiveMessage.bind(this), false);
    this.handleTheme();
    this.makeTrustedUrl();
  }
  receiveMessage(event: MessageEvent) {
    if (event.origin + '/' !== environment.naviAppUrl.split('?')[0]) return
    if (event?.data?.message === 'close-event') {
      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('');
      this.product = undefined;
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
      this.showDockedNavi = false;
      localStorage.removeItem('has_insights')
      localStorage.removeItem('IS_NAVI_OPENED')
      localStorage.removeItem('app_name')
      this.isNaviExpanded = false;
      this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
      this.makeTrustedUrl()
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
      localStorage.removeItem('IS_NAVI_OPENED')
      localStorage.removeItem('app_name')
      this.isNaviExpanded = false;
      this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
      this.makeTrustedUrl()
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
      this.conversationID = event.data.conversation_id;
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
    if (event.data.message === 'import-file-popup') {
      this.utilsService.showImportFilePopup(true);
    }
  }

  async handleTheme(): Promise<void> {
    this.colorPallet = themeing.theme;
    await this.changeTheme(this.colorPallet[6]);
    this.handleUser();
  }

  handleUser(): void {
    if (this.currentUser) {
      this.getMeTotalOnboardedApps();
      if (this.currentUser.role_name === 'Xnode Admin') {
        this.router.navigate(['/admin/user-invitation']);
      } else {
        this.router.navigate(['/my-products']);
      }
      this.preparingData();
      this.handleBotIcon();
      this.openNavi();
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
    this.utilsService.getMeImportFilePopupStatus.subscribe((data: any) => {
      if (data) {
        this.showImportFilePopup = true;
      }
    });
    this.utilsService.getMeSummaryPopupStatus.subscribe((data: any) => {
      if (data) {
        this.showSummaryPopup = true;
      }
    });
    this.getAllUsers();
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
          localStorage.removeItem('IS_NAVI_OPENED')
          localStorage.removeItem('app_name')
          this.isNaviExpanded = false;
          this.storageService.removeItem(StorageKeys.IS_NAVI_EXPANDED)
          this.makeTrustedUrl()
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
          this.conversationID = event.data.conversation_id;
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
                case 'import-file-popup':
                  this.utilsService.showImportFilePopup(true);
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
    this.product = this.storageService.getItem(StorageKeys.Product);
    const conversation: any = this.storageService.getItem(StorageKeys.CONVERSATION)
    const restriction_max_value = localStorage.getItem('restriction_max_value');
    let rawUrl: string =
      environment.naviAppUrl +
      '?email=' +
      this.currentUser?.email +
      '&targetUrl=' +
      environment.xnodeAppUrl +
      '&component=' +
      this.getMeComponent() +
      '&device_width=' +
      this.screenWidth +
      '&accountId=' +
      this.currentUser?.account_id +
      '&currentUser=' +
      JSON.stringify(this.currentUser) +
      '&token=' +
      this.storageService.getItem(StorageKeys.ACCESS_TOKEN) +
      '&user_id=' +
      this.currentUser?.user_id +
      '&account_id=' +
      this.currentUser?.account_id;
    if (restriction_max_value) {
      rawUrl =
        rawUrl + '&restriction_max_value=' + JSON.parse(restriction_max_value);
    }
    if (this.newWithNavi) {
      rawUrl = rawUrl + '&new_with_navi=' + true;
    }
    if (this.conversatonDetails) {
      rawUrl = rawUrl + '&conversatonDetails=' + JSON.stringify(this.conversatonDetails);
    }
    if (this.product) {
      this.subMenuLayoutUtil.disablePageToolsLayoutSubMenu();
      rawUrl =
        rawUrl +
        '&product_user_email=' +
        productEmail +
        '&conversationId=' +
        conversation?.id +
        '&type=' +
        conversation?.conversationType
        + '&product_context=' +
        true +
        '&accountId=' +
        this.currentUser?.account_id +
        '&product_id=' +
        this.product.id +
        '&product=' +
        JSON.stringify(this.product) +
        '&new_with_navi=' +
        false + '&componentToShow=Conversations';
    } else if (this.newWithNavi && !this.summaryObject) {
      rawUrl = rawUrl + '&componentToShow=chat';
    } else {
      let addUrl = '';
      if (this.isFileImported) {
        addUrl = '&componentToShow=Conversations';
      } else {
        if (!this.summaryObject)
          addUrl = '&componentToShow=Tasks';
      }
      rawUrl = rawUrl + addUrl; //(this.isFileImported && !this.summaryObject ? '&componentToShow=Conversations' : '&componentToShow=tasks')
    }
    if (this.summaryObject?.conversationId) {
      rawUrl = rawUrl + '&componentToShow=chat&conversationId=' + this.summaryObject?.conversationId + '&type=' + this.summaryObject?.type;
    }
    rawUrl = rawUrl + '&isNaviExpanded=' + this.isNaviExpanded;
    this.iframeUrlLoad(rawUrl);
    this.summaryObject = '';
  }

  iframeUrlLoad(rawUrl: any) {
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    const showDockedNavi: any = this.storageService.getItem(StorageKeys.IS_NAVI_OPENED);
    this.showDockedNavi = showDockedNavi ? JSON.parse(showDockedNavi) : false;
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
    this.storageService.saveItem(StorageKeys.IS_NAVI_OPENED, true);
    this.makeTrustedUrl();
  }

  getAllUsers() {
    let accountId = this.currentUser.account_id
    if (accountId) {
      let params = {
        account_id: accountId
      }
      this.auth.getUsersByAccountId(params).then((response: any) => {
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
    this.conversationHubService.getConversations('?id=' + this.conversationID + '&fieldsRequired=id,title,conversationType,content').then((res: any) => {
      if (res && res.status === 200) {
        this.convSummary = res.data[0].content.conversation_summary;
        this.showSummaryPopup = true;
      } else {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: res.data.message,
        });
      }
      this.utilsService.loadSpinner(false);
    }).catch((err => {
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
