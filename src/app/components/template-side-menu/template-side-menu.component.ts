import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppSideMenuItems } from 'src/app/constants/AppSideMenuItems';

@Component({
  selector: 'xnode-template-side-menu',
  templateUrl: './template-side-menu.component.html',
  styleUrls: ['./template-side-menu.component.scss']
})
export class TemplateSideMenuComponent {
  menuItems: any[];

  constructor() {
    this.menuItems = [
      {
        // label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/',
      },
      {
        icon: 'pi pi-chart-bar',
        routerLink: '/about',
             },
      {
        icon: 'pi pi-credit-card',
        routerLink: '/contact',
      },
      {
        icon: 'pi pi-arrows-v',
        routerLink: '/contact',
      }
      
    
    ];
  }
}
