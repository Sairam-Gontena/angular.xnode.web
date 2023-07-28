import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';
import { ApiService } from '../../api/api.service'
import { UserUtil, User } from '../../utils/user-util';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'xnode-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent {
  @Input() data: any;
  notifications: any[] = []
  activeFilter: string = '';
  allNotifications: any[] = [];
  currentUser?: User;

  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true
  }

  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService, private webSocketService: WebSocketService,) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.allNotifications = this.data
    this.notifications = this.allNotifications
  }

  navigateToProduct(obj: any): void {
    localStorage.setItem('record_id', obj.product_id);
    localStorage.setItem('app_name', obj.product_name);
    this.router.navigate(['/design']);
  }

  navigateToActivity() {
    this.router.navigate(['/activity'])
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

  publishApp(obj: any) {
    const body = {
      repoName: localStorage.getItem('app_name'),
      projectName: 'xnode',
      email: this.currentUser?.email,
      envName: environment.name,
      productId: obj.product_id
    }
    this.apiService.publishApp(body)
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

}
