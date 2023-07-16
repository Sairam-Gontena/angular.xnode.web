import { Component, OnInit } from '@angular/core';
import { HeaderItems } from '../../constants/AppHeaderItems'
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})

export class AppHeaderComponent implements OnInit {
  headerItems: any;
  logoutDropdown: any;
  selectedValue: any;

  constructor(private router: Router) {
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
  }
}
