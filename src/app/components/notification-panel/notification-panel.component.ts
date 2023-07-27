import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';
import { ApiService } from '../../api/api.service'


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

  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true
  }

  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService, private webSocketService: WebSocketService,) {
  }

  ngOnInit(): void {
    this.allNotifications = this.data
    this.notifications = this.allNotifications
  }

  navigateToProduct(productId: any): void {
    localStorage.setItem('record_id', productId)
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

  publishApp() {
    this.apiService.publishApp({ repoName: localStorage.getItem('app_name'), projectName: 'xnode' })
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

}
