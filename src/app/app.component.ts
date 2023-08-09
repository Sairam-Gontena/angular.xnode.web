import { Component, OnInit } from '@angular/core';
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
  email: String = '';
  id: String = '';
  loading?: boolean;
  sideWindow: any = document.getElementById('side-window');
  productContext: string | null = '';
  iframeUrl: SafeResourceUrl = '';
  toastObj: any;

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
      this.loading = event;
    });
    this.utilsService.getMeToastObject.subscribe((event: any) => {
      this.messageService.add(event);
    });
  }


  handleRouterChange() {
    this.isSideWindowOpen = false;
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
      let rawUrl = environment.xpilotUrl + '?email=' + this.email +
        '&productContext=' + localStorage.getItem('record_id') +
        '&targetUrl=' + environment.baseUrl +
        '&xnode_flag=' + 'XNODE-APP' + '&component=' + this.getMeComponent();
      setTimeout(() => {
        this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
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
    return window.location.hash === "#/products-config" || window.location.hash === "#/use-cases"
      || window.location.hash === "#/overview" || window.location.hash === "#/design" || window.location.hash === "#/operate" || window.location.hash === "#/publish"
      || window.location.hash === "#/activity" || window.location.hash === "#/products-config/data-modal/overview" || window.location.hash === "#/products-config/workflow/overview";
  }

  // window.location.hash === "#/configuration/data-model/overview" || window.location.hash === "#/configuration/workflow/overview"

  openNavi(newItem: any) {
    this.getUserData();
    this.isSideWindowOpen = newItem.cbFlag;
    this.productContext = newItem.productContext;
    this.makeTrustedUrl();
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
      Name: "Thimma chowdary",
      Age: 25,
      Address: "Address1",
      Email: 'thimma@gmail.comm'
    },
    {
      Name: "Thimma1",
      Age: 26,
      Address: "Address12",
      Email: 'thimma@gmail.comm'

    },
    {
      Name: "Thimma1",
      Age: 26,
      Address: "Address12",
      Email: 'thimma@gmail.comm'

    },
  ]

}
