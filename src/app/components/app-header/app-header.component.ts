import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';
import { PublishAppApiService } from '../../api/publish-app-api.service';
import { environment } from 'src/environments/environment';
import { RefreshListService } from '../../RefreshList.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { UserUtil } from 'src/app/utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { AuthApiService } from 'src/app/api/auth.service';
import themeing from '../../../themes/customized-themes.json';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { OverallSummary } from 'src/models/view-summary';
import { MessagingService } from '../services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class AppHeaderComponent implements OnInit {
  @Output() navigateToHome = new EventEmitter<object>();
  @Output() logout = new EventEmitter<any>();

  headerItems: any;
  logoutDropdown: any;
  selectedValue: any;
  convSummary?: OverallSummary;
  showViewSummaryPopup: boolean = false;
  notifObj: any;
  channel: any;
  email: string = '';
  id: string = '';
  activeFilter: string = '';
  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true,
  };
  allNotifications: any[] = [];
  notifications: any[] = [];
  notificationCount: any = 0;
  product_url: string = 'https://dev-navi.azurewebsites.net/';
  username: string = '';
  visible!: boolean;
  screenshot: any = [];
  showDialog: boolean = false;
  thanksDialog: boolean = false;
  displayReportDialog: boolean = false;
  generalFeedbackDialog: boolean = false;
  currentUser: any;
  closeOverlay: boolean = false;
  eventOverlay: any;
  opOverlay: any;
  showFeedBacks: any;
  selectedPopup: any;
  showLimitReachedPopup: boolean = false;
  productId: any;
  userImage: any;
  limitReachedContent: boolean = false;
  colorPallet: any;
  isDarkTheme: boolean = false;

  constructor(
    private RefreshListService: RefreshListService,
    private utilsService: UtilsService,
    private router: Router,
    private webSocketService: WebSocketService,
    private confirmationService: ConfirmationService,
    private captureService: NgxCaptureService,
    private auth: AuthApiService,
    private auditUtil: AuditutilsService,
    private naviApiService: NaviApiService,
    private publishAppApiService: PublishAppApiService,
    private utils: UtilsService,
    private messagingService: MessagingService,
    private conversationService: ConversationHubService,
    private storageService: LocalStorageService

  ) {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    let product = localStorage.getItem('product');
    if (product) {
      let productObj = JSON.parse(product);
      this.productId = productObj?.id;
    }
    this.utils.loadViewSummary.subscribe((event: any) => {
      if (event) {
        this.getConversation({ conversationId: event.conversationId })

      }
    })
  }

  ngOnInit(): void {
    this.colorPallet = themeing.theme;
    this.utilsService.getMeFeedbackPopupTypeToDisplay.subscribe((res: any) => {
      this.selectedPopup = '';
      if (res) {
        this.selectedPopup = res;
      }
    });
    let data = localStorage.getItem('currentUser');

    if (data) {
      let currentUser = JSON.parse(data);
      this.username =
        currentUser.first_name.toUpperCase() +
        ' ' +
        currentUser.last_name.toUpperCase();

      if (currentUser.first_name && currentUser.last_name) {
        this.userImage =
          currentUser.first_name.charAt(0).toUpperCase() +
          currentUser.last_name.charAt(0).toUpperCase();
      }
    }
    this.currentUser = UserUtil.getCurrentUser();
    this.headerItems = HeaderItems;
    this.logoutDropdown = [
      {
        label: 'Logout',
        command: () => {
          this.logout.emit()
        },
      },
    ];
    this.initializeWebsocket();
  }

  toggleFeedbackPopup() {
    this.utilsService.loadSpinner(true);
    this.capture();
    this.auditUtil.postAudit('FEEDBACK', 1, 'SUCCESS', 'user-audit');
    this.utilsService.showProductStatusPopup(false);
    this.utilsService.showLimitReachedPopup(false);
  }

  onClickHelpCenter() {
    this.router.navigate(['/help-center']);
    this.messagingService.sendMessage({
      msgType: MessageTypes.CLOSE_NAVI,
      msgData: 'CLOSE',
    });
    this.utilsService.showProductStatusPopup(false);
    this.utilsService.showLimitReachedPopup(false);
    this.auditUtil.postAudit('HELP_CENTER', 1, 'SUCCESS', 'user-audit');
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
      console.log('notification in xnode repo:', data);
      if (!data?.description.includes('You have received a message') && data.entity !== 'CHAT') {
        this.allNotifications.unshift(data);
      }
      this.notifications = this.allNotifications;
      this.notificationCount = this.notifications.length;
      if (data.product_status === 'completed') {
        this.RefreshListService.updateData('refreshproducts');
      }
      if (
        data.product_status === 'deployed' &&
        !data.product_url.includes('/login?')
      ) {
        const body = {
          url:
            data.product_url + '/login?product_id=' + data.product_id,
        };
        this.conversationService
          .updateProductUrl(body, data.product_id)
          .then((response) => {
            if (!response) {
              this.utilsService.loadToaster({
                severity: 'error',
                summary:
                  '                                                                                                                       ',
              });
            }
          })
          .catch((error) => {
            this.utilsService.loadToaster({
              severity: 'error',
              summary: '',
              detail: error,
            });
          });
      }
    });
  }

  toggleAccordion() {
    this.notificationCount = 0;
  }

  overlayToggle(event?: any, element?: any) {
    this.utilsService.showProductStatusPopup(false);
    this.utilsService.showLimitReachedPopup(false);
    if (event) {
      this.eventOverlay = event;
    }
    if (element) {
      this.opOverlay = element;
    }
    if (this.closeOverlay) {
      this.opOverlay.hide(this.eventOverlay);
    } else {
      this.opOverlay.show(this.eventOverlay);
    }
    this.closeOverlay = false;
    this.auditUtil.postAudit('NOTIFICATIONS', 1, 'SUCCESS', 'user-audit');
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
      },
    });
  }

  publishApp(obj: any): void {
    this.utilsService.loadSpinner(true);
    const product: any = this.storageService.getItem(StorageKeys.Product);
    const body = {
      repoName: obj.product_name,
      projectName: environment.projectName,
      email: this.email,
      envName: environment.branchName,
      productId: obj.product_id,
      productUuid: product?.product_uuid,
    };
    this.publishAppApiService
      .publishApp(body)
      .then((response: any) => {
        if (response) {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'PUBLISH_APP_HEADER',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail:
              'Your app publishing process started. You will get the notifications',
            life: 3000,
          });
        } else {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'PUBLISH_APP_HEADER',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Network Error',
            life: 3000,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'POST',
          url: error?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'PUBLISH_APP_HEADER',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.productId
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
          life: 3000,
        });
        this.utilsService.loadSpinner(false);
      });
  }

  onClickLogo(): void {
    this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
    this.navigateToHome.emit();
  }

  showMeLimitInfoPopup(event: any): void {
    this.showLimitReachedPopup = event;
    this.limitReachedContent = true;
  }

  viewSummaryPopup(notif: any): void {
    this.notifObj = notif;
    this.utils.loadSpinner(true);
    this.getConversation(notif)
  }
  getConversation(obj: any): void {
    this.utilsService.loadSpinner(true);
    this.conversationService.getConversations('?id=' + obj.conversationId + '&fieldsRequired=id,title,conversationType,content').then((res: any) => {
      if (res && res.status === 200) {
        this.showViewSummaryPopup = true;
        this.convSummary = res.data?.data[0].content.conversation_summary;
        this.convSummary?.incremental_summary.reverse();
      } else {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: res.data.message,
        });
      }
      this.utils.loadSpinner(false);
    }).catch((err => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({
        severity: 'error',
        summary: 'Error',
        detail: err,
      });
    }))
    this.utilsService.loadSpinner(false);

  }

}
