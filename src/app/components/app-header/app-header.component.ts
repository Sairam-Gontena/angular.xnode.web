import { Component, Input, OnInit } from '@angular/core';
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
  // product_url: any;
  product_url: string = "https://dev-navi.azurewebsites.net/";

  constructor(private RefreshListService: RefreshListService, private apiService: ApiService,
    private router: Router, private messageService: MessageService, private webSocketService: WebSocketService,) {
  }

  ngOnInit(): void {
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
    let storedRecordId = localStorage.getItem('record_id');
    console.log(storedRecordId)

    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.webSocketService.emit('join', environment.webSocketNotifier);
    this.webSocketService.onEvent(this.email).subscribe((data: any) => {
      console.log('socket message', data)
      this.allNotifications.unshift(data);
      this.notifications = this.allNotifications;
      this.notificationCount = this.notifications.length
      if (data.product_status === 'completed') {
        this.RefreshListService.updateData('refreshproducts');
      }

      if (data.product_status === 'deployed') {
        const body = {
          productUrl: data.product_url,
          product_id: storedRecordId,
        }
        console.log(body)
        this.apiService.patch(body)
          .then(response => {
            console.log(response)

            if (response) {
              this.messageService.add({ severity: 'success', summary: '', sticky: true });
            }
          })
          .catch(error => {
            console.log('error', error);
            this.messageService.add({ severity: 'error', summary: '', detail: error, sticky: true });
          });

      }
    })
  }

  toggleAccordion() {
    this.notificationCount = 0;
  }

  prepareToastToShow(event: any): void {
    this.messageService.clear();
    this.messageService.add(event);
  }
}
