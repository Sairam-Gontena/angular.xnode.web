import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';
import { UtilsService } from './components/services/utils.service';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})

export class AppComponent implements OnInit {
  title = 'xnode';
  isSideWindowOpen: boolean = false;
  isBotIconVisible: boolean = true;
  email: String = '';
  id: String = '';
  loading: boolean = true;
  isNaviExpanded?: boolean;
  sideWindow: any = document.getElementById('side-window');
  productContext: string | null = '';
  naviUrl: SafeResourceUrl = '';
  toastObj: any;
  targetUrl: string = environment.naviAppUrl;
  currentPath = window.location.hash;
  constructor(
    private domSanitizer: DomSanitizer,
    private apiService: ApiService,
    private router: Router,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private subMenuLayoutUtil: UtilsService,
    private changeDetector: ChangeDetectorRef,) {

  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouterChange();
        this.handleBotIcon(event);
      }
    });
    this.utilsService.startSpinner.subscribe((event: boolean) => {
      this.loading = event;
    });
    this.utilsService.getMeToastObject.subscribe((event: any) => {
      this.messageService.add(event);
    });
    this.currentPath = window.location.hash;
  }

  handleBotIcon(event: any): void {
    if (event.url === '/x-pilot') {
      this.isBotIconVisible = false
    } else {
      this.isBotIconVisible = true;
    }
  }

  loadIframeUrl(): void {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        // Add an event listener to listen for messages from the iframe
        window.addEventListener('message', (event) => {
          console.log('event.data', event.data);

          // Check the origin of the message to ensure it's from the iframe's domain
          if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
            console.log('not matched');
            return; // Ignore messages from untrusted sources
          }
          // Check the message content and trigger the desired event
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
    if (localStorage.getItem('record_id') !== null) {
      let rawUrl = environment.naviAppUrl + '?email=' + this.email +
        '&productContext=' + localStorage.getItem('record_id') +
        '&targetUrl=' + environment.xnodeAppUrl +
        '&xnode_flag=' + 'XNODE-APP' + '&component=' + this.getMeComponent();
      // setTimeout(() => {
      this.naviUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
      this.loadIframeUrl();
      // }, 2000);
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
    // Temporary
    return window.location.hash === "#/x-pilot" || window.location.hash === "#/configuration/data-model/overview" || window.location.hash === "#/usecases"
      || window.location.hash === "#/overview" || window.location.hash === "#/dashboard" || window.location.hash === "#/operate" || window.location.hash === "#/publish" || window.location.hash === "#/activity" || window.location.hash === "#/configuration/workflow/overview" || window.location.hash === "#/my-products";
  }



  openNavi(newItem: any) {
    if (window.location.hash === "#/my-products") {
      this.router.navigate(['/x-pilot'])
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
    this.subMenuLayoutUtil.disablePageToolsLayoutSubMenu()
    if (this.isSideWindowOpen) {
      const chatbotContainer = document.getElementById('side-window') as HTMLElement;
      chatbotContainer.style.display = 'block';
      chatbotContainer.classList.add('open');
    }
  }

  closeSideWindow() {
    this.isSideWindowOpen = false;
  }

  parentdata: any[] = [
    {
      Name: "User1",
      Age: 25,
      Address: "Address1",
      Email: 'user1@gmail.comm'
    },
    {
      Name: "User2",
      Age: 26,
      Address: "Address12",
      Email: 'user2@gmail.comm'

    },
    {
      Name: "User3",
      Age: 26,
      Address: "Address12",
      Email: 'User3@gmail.comm'

    },
  ];

  showSideMenu() {
    return window.location.hash === "#/configuration/data-model/overview" || window.location.hash === "#/usecases"
      || window.location.hash === "#/overview" || window.location.hash === "#/dashboard" || window.location.hash === "#/operate" || window.location.hash === "#/publish" || window.location.hash === "#/activity" || window.location.hash === "#/configuration/workflow/overview";

  }

}
