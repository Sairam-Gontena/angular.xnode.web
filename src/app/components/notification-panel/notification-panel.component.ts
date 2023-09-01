import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserUtil, User } from '../../utils/user-util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'xnode-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent {
  @Input() data: any;
  @Output() preparePublishPopup = new EventEmitter<any>();
  @Output() onHistoryLog = new EventEmitter<any>();
  notifications: any[] = []
  activeFilter: string = '';
  allNotifications: any[] = [];
  currentUser?: User;
  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true
  };

  constructor(private router: Router) {
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
      if (this.currentUser)
        url = `${environment.designStudioAppUrl}?email=${encodeURIComponent(this.currentUser.email)}&id=${encodeURIComponent(obj.product_id)}`;
      window.open(url, "_blank");
    }
  }

  getMeLabel(obj: any) {
    return obj.component && obj.component !== '' ? 'View Update' : 'Go to Product'
  }

  navigateToActivity() {
    this.onHistoryLog.emit(true)
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
    localStorage.setItem('record_id', obj.product_id);
    localStorage.setItem('app_name', obj.product_name);
    this.preparePublishPopup.emit(obj)
  }
}
