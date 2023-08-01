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
  @Input() productId?: string;
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
  product_url: any;
  // product_id: any;
  // product_url: string = "https://dev-navi.azurewebsites.net/";

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
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
      this.id = JSON.parse(currentUser).record_id;
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
      const body = {
        repoName: localStorage.getItem('app_name'),
        productUrl: this.product_url,
        productId: this.productId
      }
      console.log(this.productId)
      if (data.product_status === 'deployed') {
        this.apiService.patch(body)
          .then(response => {
            if (response) {
              this.messageService.add({ severity: 'success', summary: '', detail: 'Your app publishing process started. You will get the notifications', sticky: true });
              // this.loadSpinnerInParent.emit(false);
            }
          })
          .catch(error => {
            console.log('error', error);
            this.messageService.add({ severity: 'error', summary: '', detail: error, sticky: true });
            // this.loadSpinnerInParent.emit(false);
          });
        // this.apiService.patch(data).then(
        //   (response: any) => {
        //     this.product_id = response.record_id;
        //     this.product_url = response.product_url;
        //     console.log('PATCH request successful:', response);
        //     // Handle the successful response here, if needed
        //   },
        //   (error: any) => {
        //     console.error('Error in PATCH request:', error);
        //     // Handle errors here, if needed
        //   }
        // );
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
