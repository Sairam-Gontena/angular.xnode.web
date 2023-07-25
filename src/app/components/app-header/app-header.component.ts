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
  filterTypes: any = {
    recent: false,
    important: false,
    pined: false,
    all: true
  }
  allNotifications: any[] =
    [
      { id: 1, title: 'this is your 1 message', description: 'this is a description', status: 'success', type: 'notification', receivedon: '1s', read: false, important: false, pined: false, recent: true },
      { id: 2, title: 'this is your 2 message', description: 'this is a description', status: 'pending', type: 'notification', receivedon: '5m', read: false, important: false, pined: true, recent: true },
      { id: 3, title: 'this is your 3 message', description: 'this is a description', status: 'reject', type: 'notification', receivedon: '2m', read: true, important: true, pined: true, recent: false },
      { id: 4, title: 'this is your 4 message', description: 'this is a description', type: 'request', img: '', receivedon: '1h', read: true, important: false, pined: false, recent: true },
      { id: 5, title: 'this is your 5 message', description: 'this is a description', type: 'publish', icon: 'bell', receivedon: '10s', read: false, important: true, pined: true, recent: false },];
  notificationCount: Number = 0;

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

    this.router.navigate(['/overview'])
  }


  filterNotifications(val: any) {
    if (val == 'recent') {
      this.filterTypes = {
        recent: true,
        important: false,
        pined: false,
        all: false
      }
    } else if (val == 'important') {
      this.filterTypes = {
        recent: false,
        important: true,
        pined: false,
        all: false
      }
    }
    else if (val == 'pined') {
      this.filterTypes = {
        recent: false,
        important: false,
        pined: true,
        all: false
      }
    }
    else if (val == 'all') {
      this.filterTypes = {
        recent: false,
        important: false,
        pined: false,
        all: true
      }
    }
    if (val == 'all') {
      this.notifications = this.allNotifications
    } else {
      this.notifications = this.allNotifications.filter(x => x[val])

    }
  }

  toggleNotificationRead(val: any, id: number) {
    const index = this.allNotifications.findIndex(item => item.id == id);
    if (val === 'read') {
      this.allNotifications[index].read = true;
    } else if (val === 'unread') {
      this.allNotifications[index].read = false;
    }
    this.notifications = this.allNotifications
    this.notifications = this.allNotifications.filter(x => x['read'])

  }
  toggleNotificationPinned(val: any, id: number) {
    const index = this.allNotifications.findIndex(item => item.id == id);

    if (val === 'pined') {
      this.allNotifications[index].pined = true;
    } else if (val === 'unpined') {
      this.allNotifications[index].pined = false;
    }
    this.notifications = this.allNotifications.filter(x => x['pined'])

  }


}
