import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';
import { ApiService } from '../../api/api.service'
import { environment } from 'src/environments/environment';
import { RefreshListService } from '../../RefreshList.service'
import { UtilsService } from 'src/app/components/services/utils.service';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
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

  constructor(private RefreshListService: RefreshListService, private apiService: ApiService, private utilsService: UtilsService,
    private router: Router, private webSocketService: WebSocketService, private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private captureService: NgxCaptureService) {
  }

  ngOnInit(): void {
    let data = localStorage.getItem("currentUser")
    if (data) {
      let currentUser = JSON.parse(data);
      this.username = currentUser.first_name.toUpperCase() + " " + currentUser.last_name.toUpperCase();
    }
    this.currentUser = UserUtil.getCurrentUser();

    this.getAllProducts()

    this.headerItems = HeaderItems;
    this.logoutDropdown = [
      {
        label: 'Logout',
        command: () => {
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
          console.log(this.templates)
        }
      })
      .catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
      });
  }
  toggleDialog() {
    this.showDialog = true;
  }
  handleDataAndAction(event: any) {
    console.log(event.value)

    switch (event.value) {
      case 'feedback':
        this.showDialog = true;
        this.displayReportDialog = false;
        this.generalFeedbackDialog = false;
        this.thanksDialog = false;
        break;
      case 'reportBug':
        this.showDialog = false;
        this.displayReportDialog = true;
        this.generalFeedbackDialog = false;
        this.thanksDialog = false;
        break;
      case 'generalFeedback':
        this.showDialog = false;
        this.displayReportDialog = false;
        this.generalFeedbackDialog = true;
        this.thanksDialog = false;
        break;
      case 'thankYou':
        this.showDialog = false;
        this.displayReportDialog = false;
        this.generalFeedbackDialog = false;
        this.thanksDialog = true;
        break;
      default:
        break;
    }
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

  isHelpCentre() {
    // Temporary
    if (window.location.hash === "#/x-pilot" || window.location.hash === "#/my-products") {
      return false;
    } else {
      return true;
    }
  }
}
