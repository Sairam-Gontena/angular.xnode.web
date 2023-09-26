import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';
import { ApiService } from '../../api/api.service'
import { environment } from 'src/environments/environment';
import { RefreshListService } from '../../RefreshList.service'
import { UtilsService } from 'src/app/components/services/utils.service';
import { FormBuilder } from '@angular/forms';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { UserUtil } from 'src/app/utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service'
import { AuthApiService } from 'src/app/api/auth.service';


@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  providers: [MessageService, ConfirmationService],
})

export class AppHeaderComponent implements OnInit {
  @Input() currentPath: any;
  headerItems: any;
  logoutDropdown: any;
  selectedValue: any;
  channel: any;
  email: string = '';
  id: string = '';
  activeFilter: string = '';
  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true
  };
  allNotifications: any[] = [];
  notifications: any[] = [];
  notificationCount: any = 0;
  product_url: string = "https://dev-navi.azurewebsites.net/";
  username: string = ''
  visible!: boolean;
  screenshot: any = [];
  showDialog: boolean = false;
  thanksDialog: boolean = false;
  displayReportDialog: boolean = false;
  generalFeedbackDialog: boolean = false;
  currentUser: any;
  templates: any[] = [];
  closeOverlay: boolean = false;
  eventOverlay: any;
  opOverlay: any;
  showFeedBacks: any;
  selectedPopup: any;
  showLimitReachedPopup: boolean = false;
  productId: any;
  dpName: any;


  constructor(
    private RefreshListService: RefreshListService,
    private apiService: ApiService,
    private utilsService: UtilsService,
    private router: Router,
    private webSocketService: WebSocketService,
    private confirmationService: ConfirmationService,
    private captureService: NgxCaptureService,
    private auth: AuthApiService,
    private auditUtil: AuditutilsService) {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    let product = localStorage.getItem('product')
    if (product) {
      let productObj = JSON.parse(product)
      this.productId = productObj?.id;
    }
  }

  ngOnInit(): void {
    this.utilsService.getMeFeedbackPopupTypeToDisplay.subscribe((res: any) => {
      this.selectedPopup = '';
      if (res) {
        this.selectedPopup = res;
      }
    })
    let data = localStorage.getItem("currentUser")

    if (data) {
      let currentUser = JSON.parse(data);
      this.username = currentUser.first_name.toUpperCase() + ' ' + currentUser.last_name.toUpperCase();

      if (currentUser.first_name && currentUser.last_name) {
        this.dpName = currentUser.first_name.charAt(0).toUpperCase() + currentUser.last_name.charAt(0).toUpperCase();
      }
    }
    this.currentUser = UserUtil.getCurrentUser();
    this.getAllProducts()
    this.headerItems = HeaderItems;
    this.logoutDropdown = [
      {
        label: 'Logout',
        command: () => {
          this.auditUtil.post('LOGGED_OUT', 1, 'SUCCESS', 'user-audit');
          this.utilsService.showProductStatusPopup(false);
          this.utilsService.showLimitReachedPopup(false);
          setTimeout(() => {
            localStorage.clear();
            this.auth.setUser(false);
            this.router.navigate(['/']);
          }, 1000);
        }
      },
    ];
    this.initializeWebsocket();
  }

  //get calls 
  getAllProducts(): void {
    this.apiService.get("/get_metadata/" + this.currentUser.email)
      .then(response => {
        if (response?.status === 200 && response.data.data?.length) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_ALL_PRODUCTS_GET_METADATA', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
          const data = response.data.data.map((obj: any) => ({
            name: obj.title,
            value: obj.id,
            url: obj.product_url !== undefined ? obj.product_url : ''
          }));
          this.templates = data;
        }
      }).catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_ALL_PRODUCTS_GET_METADATA', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
      });
  }

  toggleFeedbackPopup() {
    this.utilsService.loadSpinner(true);
    this.capture();
    this.auditUtil.post('FEEDBACK', 1, 'SUCCESS', 'user-audit');
    this.utilsService.showProductStatusPopup(false);
    this.utilsService.showLimitReachedPopup(false);
  }

  onClickHelpCenter() {
    this.router.navigate(['/help-center']);
    this.utilsService.showProductStatusPopup(false);
    this.utilsService.showLimitReachedPopup(false);
    this.auditUtil.post('HELP_CENTER', 1, 'SUCCESS', 'user-audit');
  }

  capture(): void {
    this.captureService
      .getImage(document.body, true)
      .pipe(
        tap((img) => {
          this.screenshot = img;
          this.utilsService.showProductStatusPopup(false);
          this.selectedPopup = 'customer-feedback';
          this.utilsService.loadSpinner(false);
        })
      )
      .subscribe();
  }


  initializeWebsocket() {
    this.webSocketService.emit('join', environment.webSocketNotifier);
    this.webSocketService.onEvent(this.email).subscribe((data: any) => {
      this.allNotifications.unshift(data);
      this.notifications = this.allNotifications;
      this.notificationCount = this.notifications.length
      if (data.product_status === 'completed') {
        this.RefreshListService.updateData('refreshproducts');
      }
      if (data.product_status === 'deployed' && !data.product_url.includes('/login?')) {
        const body = {
          product_id: data.product_id,
          product_url: data.product_url + '/login?product_id=' + data.product_id,
        }
        this.apiService.patch(body, '/update_product_url')
          .then(response => {
            if (!response) {
              this.utilsService.loadToaster({ severity: 'error', summary: '                                                                                                                       ' });
            }
          })
          .catch(error => {
            this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
          });
      }
    })
  }

  toggleAccordion() {
    this.notificationCount = 0;
  }

  overlayToggle(event?: any, element?: any) {
    this.utilsService.showProductStatusPopup(false);
    this.utilsService.showLimitReachedPopup(false);
    if (event) {
      this.eventOverlay = event;
    } if (element) {
      this.opOverlay = element;
    }
    if (this.closeOverlay) {
      this.opOverlay.hide(this.eventOverlay);
    } else {
      this.opOverlay.show(this.eventOverlay);
    }
    this.closeOverlay = false;
    this.auditUtil.post('NOTIFICATIONS', 1, 'SUCCESS', 'user-audit');
  }

  overlayToggleFromNotificationPanel(event: any) {
    if (event) {
      this.closeOverlay = true;
      this.overlayToggle();
    }
  }

  showMePublishPopup(obj: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to publish this product?',
      header: 'Confirmation',
      accept: () => {
        this.publishApp(obj);
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  publishApp(obj: any): void {
    this.utilsService.loadSpinner(true)
    const body = {
      repoName: obj.product_name,
      projectName: environment.projectName,
      email: this.email,
      envName: environment.branchName,
      productId: obj.product_id
    }
    this.apiService.publishApp(body).then((response: any) => {
      if (response) {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('PUBLISH_APP_HEADER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Your app publishing process started. You will get the notifications', life: 3000 });
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('PUBLISH_APP_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'Network Error', life: 3000 });
      }
      this.utilsService.loadSpinner(false);
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('PUBLISH_APP_HEADER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error, life: 3000 });
      this.utilsService.loadSpinner(false);
    });
  }

  onClickLogo(): void {
    this.utilsService.showProductStatusPopup(false);
    this.router.navigate(['/my-products']);
  }

  showMeLimitInfoPopup(event: any): void {
    this.showLimitReachedPopup = event;
  }

}
