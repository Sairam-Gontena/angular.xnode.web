import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';
import Pusher from 'pusher-js';



@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
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


  constructor(private router: Router) {
    // Create a new Pusher instance with your Pusher App Key and options
    this.pusher = new Pusher('f641637ec102c219e3b5', {
      cluster: 'us2'
    });
  }

  ngOnInit(): void {
    this.headerItems = HeaderItems;
    this.logoutDropdown = [
      {
        label: 'Logout',
        command: () => {
          localStorage.clear();
          this.router.navigate(['/'])
        }
      },
    ];
    this.pusherInitializer()
  }

  pusherInitializer() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
    }
    this.channel = this.pusher.subscribe('navi-notifier');
    this.channel.bind(this.email, (data: any) => {
      this.notifications.push(data);
    });
  }

  toggleAccordion() {
    this.enableNotificationCard = !this.enableNotificationCard
  }

}
