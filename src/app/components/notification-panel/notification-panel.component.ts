import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserUtil, User } from '../../utils/user-util';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from '../services/utils.service';
import { NotifyApiService } from 'src/app/api/notify.service';

@Component({
  selector: 'xnode-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent {
  @Input() data: any;
  @Output() preparePublishPopup = new EventEmitter<any>();
  @Output() showMeLimitInfoPopup = new EventEmitter<any>();
  @Output() closeNotificationPanel = new EventEmitter<any>();
  notifications: any[] = []
  activeFilter: string = '';
  allNotifications: any[] = [];
  currentUser?: any;
  account_id: any;
  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true
  };

  constructor(private router: Router, private apiService: ApiService,
    private utils: UtilsService, private notifyApi: NotifyApiService) {
  }

  ngOnInit(): void {
    this.allNotifications = this.data
    this.notifications = this.allNotifications;
    this.currentUser = UserUtil.getCurrentUser();
  }

  navigateToProduct(obj: any): void {
    localStorage.setItem('record_id', obj.product_id);
    localStorage.setItem('app_name', obj.product_name);
    let url: any;
    if (obj.component && obj.component !== '') {
      if (window.location.hash === '#/' + obj.component) {
        window.location.reload();
      } else {
        this.router.navigate(['/' + obj.component]);
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getMeLabel(obj: any) {
    return obj.component && obj.component !== '' ? 'View Update' : 'Go to Product'
  }

  navigateToActivity() {
    this.closeNotificationPanel.emit(true)
    this.router.navigate(['/operate/change/history-log'])
  }

  filterNotifications(val: any) {
    if (val === 'all') {
      this.filterTypes = {
        recent: false,
        important: false,
        pinned: false,
        all: true
      };
      this.notifications = this.allNotifications;
    } else {
      this.filterTypes = {
        recent: false,
        important: false,
        pinned: false,
        all: false,
        [val]: true
      };
      this.notifications = this.allNotifications.filter((x) => x[val]);
    }

  }

  toggleNotificationRead(val: any, id: number) {
    const index = this.allNotifications.findIndex(item => item.id === id);
    this.allNotifications[index].read = val === 'read';
  }


  toggleNotificationPinned(val: any, id: number) {
    const index = this.allNotifications.findIndex(item => item.id === id);
    this.allNotifications[index].pinned = val === 'pinned';
  }

  onClickPublish(obj: any): void {
    this.getMeTotalAppsPublishedCount(obj);
  }

  getMeTotalAppsPublishedCount(obj: any): void {
    this.apiService.get('/total_apps_published/' + this.currentUser?.account_id).then((res: any) => {
      if (res && res.status === 200) {
        const restriction_max_value = localStorage.getItem('restriction_max_value');
        if (restriction_max_value) {
          if (res.data.total_apps_published >= restriction_max_value) {
            this.showMeLimitInfoPopup.emit(true);
            this.sendEmailNotificationToTheUser();
          } else {
            this.publishApp(obj);
          }
        }
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data.detail, life: 3000 });

      }
    }).catch((err: any) => {
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err, life: 3000 });
    })
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
      "emailTemplateCode": "PUBLISH_APP_LIMIT_EXCEEDED",
      "params": { "username": this.currentUser?.first_name + " " + this.currentUser?.last_name }
    }
    this.notifyApi.post(body, 'email/notify').then((res: any) => {
      if (res && res?.data?.detail) {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data.detail });
      }
    }).catch((err: any) => {
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  publishApp(obj: any): void {
    localStorage.setItem('record_id', obj.product_id);
    localStorage.setItem('app_name', obj.product_name);
    this.preparePublishPopup.emit(obj)
  }
}

