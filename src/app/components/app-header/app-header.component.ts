import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';

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
  allNotifications: any[] =
    [
      { id: 1, title: 'Your finbuddy app got published', description: 'Your finbuddy app got published and ready to use with the url https://finbuddy.com', status: 'success', type: 'notification', receivedon: '1s', read: false, important: false, pinned: false, recent: true },
      { id: 2, title: 'Your todo app is in pending', description: 'Your todo app is in pending state publish your todo app', status: 'pending', type: 'notification', receivedon: '5m', read: false, important: false, pinned: true, recent: true },
      { id: 3, title: 'Finbuddy app declined', description: 'Your todo app got rejected for in security rules, please update the security rules and publish the app', status: 'reject', type: 'notification', receivedon: '2m', read: true, important: true, pinned: true, recent: false },
      { id: 4, title: 'Tim requested finbuddy app to publish', type: 'request', img: '', receivedon: '1h', read: true, important: false, pinned: false, recent: true },
      { id: 5, title: 'Your app got published', description: 'Your app got published and ready to use with url https://example.com', type: 'publish', icon: 'bell', receivedon: '10s', read: false, important: true, pinned: true, recent: false },];
  notificationCount: any = 0;


  constructor(private router: Router, private messageService: MessageService, private webSocketService: WebSocketService) {
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


}
