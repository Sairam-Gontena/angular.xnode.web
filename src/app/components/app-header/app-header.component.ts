import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';
import { ApiService } from '../../api/api.service'
import { environment } from 'src/environments/environment';
import { RefreshListService } from '../../RefreshList.service'

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
  channel: any;
  email: string = '';
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

  constructor(private RefreshListService: RefreshListService, private apiService: ApiService, private router: Router, private messageService: MessageService, private webSocketService: WebSocketService,) {
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
  }

  initializeWebsocket() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.webSocketService.emit('join', environment.webSocketNotifier);
    this.webSocketService.onEvent(this.email).subscribe((data: any) => {
      this.allNotifications.unshift(data);
      console.log(data)
      this.notifications = this.allNotifications;
      this.notificationCount = this.notifications.length
      if (data.product_status === 'completed') {
        this.RefreshListService.updateData('refreshproducts');
      }

    })
  }

  toggleAccordion() {
    this.notificationCount = 0;
  }

}
