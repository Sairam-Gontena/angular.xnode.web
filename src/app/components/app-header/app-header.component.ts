import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { WebSocketService } from 'src/app/web-socket.service';

@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  providers: [MessageService]
})

export class AppHeaderComponent implements OnInit {
  headerItems: any;
  logoutDropdown: any;
  selectedValue: any;
  enableNotificationCard: boolean = false;
  channel: any;
  email: string = '';
  notifications: any[] = [];
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
    this.pusherInitializer()
  }

  goToProducts(): void {
    this.router.navigate(['/my-templates']);
  }

  pusherInitializer() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.webSocketService.emit('join', 'navi-notifier');
    this.webSocketService.onEvent(this.email).subscribe((data: any) => {
      this.notifications.push(data);
      this.notificationCount = this.notifications.length
    })
  }

  toggleAccordion() {
    this.enableNotificationCard = !this.enableNotificationCard
    this.notificationCount = 0;
  }

}
