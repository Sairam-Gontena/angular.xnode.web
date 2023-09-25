import { Component, OnInit } from '@angular/core';
import { UtilsService } from './components/services/utils.service';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { AuditutilsService } from './api/auditutils.service';
import { ApiService } from './api/api.service';
import { NotifyApiService } from './api/notify.service';
import { AuthApiService } from './api/auth.service';
@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
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

  constructor(
    private domSanitizer: DomSanitizer,
    private router: Router,
    private utilsService: UtilsService,
    private apiService: ApiService,
    private messageService: MessageService,
    private subMenuLayoutUtil: UtilsService,
    private spinner: NgxSpinnerService,
    private auditUtil: AuditutilsService,
    public auth: AuthApiService,
    private notifyApi: NotifyApiService) {
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
        this.router.navigate(['/'])
        localStorage.clear();
      }
    }

  }
  preparingData() {
    this.utilsService.startSpinner.subscribe((event: boolean) => {
      setTimeout(() => {
        if (event) {
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
      }, 0);
    });
    this.utilsService.getMeToastObject.subscribe((event: any) => {
      this.messageService.add(event);
    });
    this.utilsService.getMeProductStatus.subscribe((event: any) => {
      this.showProductStatusPopup = event;
    });
    this.utilsService.handleLimitReachedPopup.subscribe((event: any) => {
      this.showLimitReachedPopup = event;
      if (event) {
        let currentUser = localStorage.getItem('currentUser')
        if (currentUser) {
          this.currentUser = JSON.parse(currentUser);
        }
        this.sendEmailNotificationToTheUser();
      }
    });
  }
  handleBotIcon() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouterChange();
        if (event.url === '/x-pilot') {
          this.isBotIconVisible = false
        } else {
          this.isBotIconVisible = true;
        }
      }
    });
  }
  getMeTotalOnboardedApps(user: any): void {
    this.apiService.get("/total_apps_onboarded/" + user?.email)
      .then((response: any) => {
        if (response?.status === 200) {
          localStorage.setItem('total_apps_onboarded', response.data.total_apps_onboarded);
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail });
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
        this.utilsService.loadSpinner(true);
      });
  }


  loadIframeUrl(): void {
    window.addEventListener('message', (event) => {
      if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
        return;
      }
      if (event.data === 'triggerCustomEvent') {
        this.isSideWindowOpen = false;
        this.isNaviExpanded = false;
      }
      if (event.data === 'close-docked-navi') {
        this.isSideWindowOpen = false;
        this.isNaviExpanded = false;
      }
      if (event.data === 'expand-navi') {
        this.isNaviExpanded = true;
      }
      if (event.data === 'contract-navi') {
        this.isNaviExpanded = false;
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
          if (event.data === 'triggerCustomEvent') {
            this.isSideWindowOpen = false;
            this.isNaviExpanded = false;
          }
          if (event.data === 'close-docked-navi') {
            this.isSideWindowOpen = false;
            this.isNaviExpanded = false;
          }
          if (event.data === 'expand-navi') {
            this.isNaviExpanded = true;
          }
          if (event.data === 'contract-navi') {
            this.isNaviExpanded = false;
          }
        });
      }
    });
  }

  handleRouterChange() {
    this.isSideWindowOpen = false;
  }

  getUserData() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser && localStorage.getItem('record_id')) {
      this.email = JSON.parse(currentUser).email;
    } else {
      console.log("current user not found");
    }
  }

  makeTrustedUrl(): void {
    let user = localStorage.getItem('currentUser');
    let id;
    const has_insights = localStorage.getItem('has_insights');
    if (localStorage.getItem('record_id') !== null) {
      if (user) {
        id = JSON.parse(user).user_id;
      }
      let rawUrl = environment.naviAppUrl + '?email=' + this.email +
        '&productContext=' + localStorage.getItem('record_id') +
        '&targetUrl=' + environment.xnodeAppUrl +
        '&xnode_flag=' + 'XNODE-APP' + '&component=' + this.getMeComponent() + '&user_id=' + id;
      if (has_insights) {
        rawUrl = rawUrl + '&has_insights=' + JSON.parse(has_insights)
      }
      setTimeout(() => {
        this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        this.loadIframeUrl();
      }, 2000);
    } else {
      alert("Invalid record id")
    }

  }

  getMeComponent() {
    let comp = '';
    switch (this.router.url) {
      case '/dashboard':
        comp = 'dashboard'
        break;
      case '/overview':
        comp = 'overview'
        break;
      case '/usecases':
        comp = 'usecase'
        break;
      case '/configuration/workflow/overview':
        comp = 'xflows'
        break;
      case '/configuration/data-model/overview':
        comp = 'data_model'
        break;
      case '/operate':
        comp = 'operate'
        break;
      case '/publish':
        comp = 'publish'
        break;
      default:
        break;
    }
    return comp;
  }

  isUserExists() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser
  }

  openNavi(newItem: any) {
    if (window.location.hash === "#/my-products" || window.location.hash === "#/help-center") {
      let currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        this.auditUtil.post('NAVI_OPENED', 1, 'SUCCESS', 'user-audit');
      }
      this.router.navigate(['/x-pilot']);
    } else {
      this.getUserData();
      this.isSideWindowOpen = newItem.cbFlag;
      this.productContext = newItem.productContext;
      this.makeTrustedUrl();
    }
  }

  toggleSideWindow() {
    this.isSideWindowOpen = !this.isSideWindowOpen;
    const chatbotContainer = document.getElementById('side-window') as HTMLElement;
    chatbotContainer.classList.remove('open');
    chatbotContainer.classList.add('chatbot-closing');
    setTimeout(() => {
      chatbotContainer.style.display = 'none';
      chatbotContainer.classList.remove('chatbot-closing');
    }, 1000);
  }

  submenuFunc() {
    this.subMenuLayoutUtil.disablePageToolsLayoutSubMenu();
    if (this.isSideWindowOpen) {
      const chatbotContainer = document.getElementById('side-window') as HTMLElement;
      chatbotContainer.style.display = 'block';
      chatbotContainer.classList.add('open');
    }
  }

  closeSideWindow() {
    this.isSideWindowOpen = false;
  }

  showSideMenu() {
    return window.location.hash === "#/configuration/data-model/overview" || window.location.hash === "#/usecases"
      || window.location.hash === "#/overview" || window.location.hash === "#/dashboard" || window.location.hash === "#/operate" || window.location.hash === "#/publish" || window.location.hash === "#/activity" || window.location.hash === "#/configuration/workflow/overview" || window.location.hash === "#/admin/user-invitation" || window.location.hash === "#/admin/user-approval"
      || window.location.hash === "#/configuration/workflow/overview" || window.location.hash === "#/logs" || window.location.hash === '#/operate/change/history-log';
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
      "emailTemplateCode": "CREATE_APP_LIMIT_EXCEEDED",
      "params": { "username": this.currentUser?.first_name + " " + this.currentUser?.last_name }
    }
    this.notifyApi.post(body, 'email/notify').then((res: any) => {
      if (res?.data?.detail) {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.detail });
      }
    }).catch((err: any) => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err?.response?.data?.detail });
    })
  }
}
