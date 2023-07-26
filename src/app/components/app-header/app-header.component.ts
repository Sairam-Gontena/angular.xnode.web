import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';
import { ApiService } from '../../api/api.service'

@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  providers: [MessageService],
})

export class AppHeaderComponent implements OnInit {
  headerItems: any;
  logoutDropdown: any;
  selectedValue: any;
  enableNotificationCard: boolean = false;
  channel: any;
  email: string = '';
  notifications: any[] = []
  activeFilter: string = '';
  filterTypes: any = {
    recent: false,
    important: false,
    pinned: false,
    all: true
  }
  allNotifications: any[] = [];
  notificationCount: any = 0;

  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService, private webSocketService: WebSocketService,) {
  }

  ngOnInit(): void {
    this.messageService.add({ severity: 'warning', summary: '', detail: "test" });
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
    this.notifications = this.allNotifications
  }

  goToProducts(): void {
    this.router.navigate(['/my-products']);
  }

  initializeWebsocket() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.webSocketService.emit('join', 'xnode-notifier');
    this.webSocketService.onEvent(this.email).subscribe((data: any) => {
      this.notifications.push(data);
      this.notificationCount = this.notifications.length
    })
  }

  toggleAccordion() {
    this.enableNotificationCard = !this.enableNotificationCard
    this.notificationCount = 0;
  }

  navigateToUrl() {

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

  navigateToPublish() {
    this.apiService.publishApp({ repoName: localStorage.getItem('app_name'), projectName: 'xnode' })
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.log('error', error);
      });
  }


}
