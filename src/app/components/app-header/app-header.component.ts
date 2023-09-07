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
  screenshot: any;
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

  constructor(private RefreshListService: RefreshListService, private apiService: ApiService, private utilsService: UtilsService,
    private router: Router, private webSocketService: WebSocketService, private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private captureService: NgxCaptureService) {
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
      this.username = currentUser.xnode_user_data.first_name.toUpperCase() + ' ' + currentUser.xnode_user_data.last_name.toUpperCase();

    }
    this.currentUser = UserUtil.getCurrentUser();
    this.getAllProducts()
    this.headerItems = HeaderItems;
    this.logoutDropdown = [
      {
        label: 'Logout',
        command: () => {
          this.utilsService.showProductStatusPopup(false);
          localStorage.clear();
          this.router.navigate(['/']);
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
          const data = response.data.data.map((obj: any) => ({
            name: obj.title,
            value: obj.id,
            url: obj.product_url !== undefined ? obj.product_url : ''
          }));
          this.templates = data;
        }
      })
      .catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
      });
  }

  toggleFeedbackPopup() {
    this.capture();
    this.utilsService.showProductStatusPopup(false);
    this.selectedPopup = 'customer-feedback';
  }

  onClickHelpCenter() {
    this.router.navigate(['/help-center']);
    this.utilsService.showProductStatusPopup(false);
  }

  capture(): void {
    this.captureService
      .getImage(document.body, true)
      .pipe(
        tap((img) => {
          this.screenshot = img;
        })
      )
      .subscribe();
  }


  initializeWebsocket() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.webSocketService.emit('join', environment.webSocketNotifier);
    this.webSocketService.onEvent(this.email).subscribe((data: any) => {
      this.allNotifications.unshift(data);
      this.notifications = this.allNotifications;
      this.notificationCount = this.notifications.length
      if (data.product_status === 'completed') {
        this.RefreshListService.updateData('refreshproducts');
      }
      if (data.product_status === 'deployed') {
        const body = {
          product_id: data.product_id,
          product_url: data.product_url,
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
      projectName: 'xnode',
      email: this.email,
      envName: environment.branchName,
      productId: obj.product_id
    }
    this.apiService.publishApp(body)
      .then(response => {
        if (response) {
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Your app publishing process started. You will get the notifications', life: 3000 });
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'Network Error', life: 3000 });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error, life: 3000 });
        this.utilsService.loadSpinner(false);
      });
  }

  onClickLogo(): void {
    this.utilsService.showProductStatusPopup(false);
    this.router.navigate(['/my-products']);
  }

}
