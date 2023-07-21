import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import Pusher from 'pusher-js';
import { MessageService } from 'primeng/api';

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
  pusher: Pusher;
  channel: any;
  email: String = '';
  notifications: any[] = [];
  notificationCount: Number = 0;


  constructor(private router: Router, private messageService: MessageService) {
    // Create a new Pusher instance with your Pusher App Key and options
    this.pusher = new Pusher('f641637ec102c219e3b5', {
      cluster: 'us2'
    });
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
    this.channel = this.pusher.subscribe('navi-notifier');
    this.channel.bind(this.email, (data: any) => {
      console.log('data>>>', data);
      this.messageService.clear();
      // this.messageService.add({ severity: 'warning', summary: '', detail: data.message });
      this.notifications.push(data);
      this.notificationCount = this.notifications.length
    });
  }

  toggleAccordion() {
    this.enableNotificationCard = !this.enableNotificationCard
    this.notificationCount = 0;
  }

}
