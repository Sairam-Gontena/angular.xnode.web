import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('myIframe') iframe?: ElementRef;
  @ViewChild('expand-navi-iframe') expandNaviIframe?: ElementRef;
  safeUrl: SafeResourceUrl = '';
  title = 'xnode';
  isNaviOpened: boolean = false;
  email: String = '';
  id: String = '';
  loading: boolean = true;
  sideWindow: any = document.getElementById('side-window');
  productContext: string | null = '';
  iframeUrl: SafeResourceUrl = '';
  toastObj: any;
  targetUrl: string = environment.naviUrl;
  currentPath = window.location.hash;
  showMeExpandedNavi?: boolean;

  constructor(
    private domSanitizer: DomSanitizer,
    private apiService: ApiService,
    private router: Router,
    private utilsService: UtilsService,
    private messageService: MessageService,
    private subMenuLayoutUtil: UtilsService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouterChange();
      }
    });
    this.utilsService.startSpinner.subscribe((event: boolean) => {
      setTimeout(() => {
        this.loading = event;
      }, 0);
    });
    this.utilsService.getMeToastObject.subscribe((event: any) => {
      this.messageService.add(event);
    });
    this.currentPath = window.location.hash;
  }

  loadIframeUrl(): void {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        // Add an event listener to listen for messages from the iframe
        window.addEventListener('message', (event) => {
          // Check the origin of the message to ensure it's from the iframe's domain
          if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
            console.log('not matched');
            return; // Ignore messages from untrusted sources
          }
          // Check the message content and trigger the desired event
          if (event.data === 'triggerCustomEvent') {
            this.isNaviOpened = false;
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
          if (event.data === 'expand-navi') {
            this.isNaviOpened = false;
            this.showMeExpandedNavi = true;
            console.log('showMeExpandedNavi', this.showMeExpandedNavi);

          }
        });
      }
    });
    const expandNaviIframe = document.getElementById('expand-navi-iframe') as HTMLIFrameElement;
    expandNaviIframe.addEventListener('load', () => {
      const contentWindow = expandNaviIframe.contentWindow;
      if (contentWindow) {
        // Add an event listener to listen for messages from the iframe
        window.addEventListener('message', (event) => {
          // Check the origin of the message to ensure it's from the iframe's domain
          if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
            console.log('not matched');
            return; // Ignore messages from untrusted sources
          }
          // Check the message content and trigger the desired event
          if (event.data === 'triggerCustomEvent') {
            this.isNaviOpened = false;
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
          if (event.data === 'expand-navi') {
            this.isNaviOpened = false;
            this.showMeExpandedNavi = true;
            console.log('showMeExpandedNavi', this.showMeExpandedNavi);

          }
        });
      }
    });
  }



  handleRouterChange() {
    this.isNaviOpened = false;
  }

  getUserData() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser && localStorage.getItem('record_id')) {
      this.email = JSON.parse(currentUser).email;
      this.get_Conversation();
    } else {
      console.log("current user not found");
    }
  }

  makeTrustedUrl(): void {
    if (localStorage.getItem('record_id') !== null) {
      let rawUrl = environment.naviUrl + '?email=' + this.email +
        '&productContext=' + localStorage.getItem('record_id') +
        '&targetUrl=' + environment.baseUrl +
        '&xnode_flag=' + 'XNODE-APP' + '&component=' + this.getMeComponent();
      setTimeout(() => {
        this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        this.loadIframeUrl();
      }, 2000);
    } else {
      alert("Invalid record id")
    }

  }

  getMeComponent() {
    let comp = '';
    switch (this.router.url) {
      case '/design':
        comp = 'dashboard'
        break;
      case '/overview':
        comp = 'overview'
        break;
      case '/usecases':
        comp = 'usecases'
        break;
      case '/configuration/workflow/overview':
        comp = 'xflows'
        break;
      case '/configuration/data-model/overview':
        comp = 'data_model'
        break;
      default:
        break;
    }
    return comp;
  }

  get_Conversation() {
    this.apiService.get("/get_conversation/" + this.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = response?.data;
        }
      })
      .catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
      });
  }

  isUserExists() {
    // Temporary
    return window.location.hash === "#/x-pilot" || window.location.hash === "#/configuration/data-model/overview" || window.location.hash === "#/use-cases"
      || window.location.hash === "#/overview" || window.location.hash === "#/design" || window.location.hash === "#/operate" || window.location.hash === "#/publish" || window.location.hash === "#/activity" || window.location.hash === "#/configuration/workflow/overview";
  }



  openNavi(newItem: any) {
    this.getUserData();
    this.isNaviOpened = newItem.cbFlag;
    this.productContext = newItem.productContext;
    this.makeTrustedUrl();
  }

  toggleSideWindow() {
    this.isNaviOpened = !this.isNaviOpened;
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
    if (this.isNaviOpened) {
      const chatbotContainer = document.getElementById('side-window') as HTMLElement;
      chatbotContainer.style.display = 'block';
      chatbotContainer.classList.add('open');
    }
  }

  closeSideWindow() {
    this.isNaviOpened = false;
  }

  showSideMenu() {
    return window.location.hash === "#/configuration/data-model/overview" || window.location.hash === "#/use-cases"
      || window.location.hash === "#/overview" || window.location.hash === "#/design" || window.location.hash === "#/operate" || window.location.hash === "#/publish" || window.location.hash === "#/activity" || window.location.hash === "#/configuration/workflow/overview";

  }

}
