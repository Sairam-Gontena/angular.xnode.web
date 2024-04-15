import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppSideMenuItems } from '../../constants/AppSideMenuItems';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { UserUtil } from '../../utils/user-util';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { MessagingService } from '../services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';

@Component({
  selector: 'xnode-app-side-menu',
  templateUrl: './app-side-menu.component.html',
  styleUrls: ['./app-side-menu.component.scss'],
})
export class AppSideMenuComponent implements OnInit {
  @Output() navigateToHome = new EventEmitter<object>();
  @Output() enableDockedNavi = new EventEmitter<Object>();
  sideMenuItems: any;
  selectedMenuIndex: any;
  currentUser?: any;
  href: any;
  currentPath: any;
  isInProductContext: boolean = false;
  constructor(
    private router: Router,
    private storageService: LocalStorageService,
    private messagingService: MessagingService
  ) {
    this.currentUser = UserUtil.getCurrentUser();
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      if (msg.msgType === MessageTypes.PRODUCT_CONTEXT) {
        this.isInProductContext = msg.msgData;
        this.prepareMenuBasedOnRoute();
      }
    })
  }

  ngOnInit(): void {
    const product: any = this.storageService.getItem(StorageKeys.Product)
    if (product) {
      this.isInProductContext = true;
    } else
      this.isInProductContext = false;
    this.prepareMenuBasedOnRoute();
  }

  prepareMenuBasedOnRoute(): void {
    let entityName:any = this.storageService.getItem(StorageKeys.USERLIST);
    entityName = entityName[0].entity_name;
    if (!this.isInProductContext) {
      this.sideMenuItems = [
        {
          label: 'Home',
          icon: './assets/home.svg',
          path: 'my-products',
        },
        // {
        //   label: 'Agents',
        //   icon: './assets/agent-hub/agent-sidebar.svg',
        //   path: 'agent-playground/',
        // },
        // {
        //   label: 'Knowledge',
        //   icon: './assets/accounts.svg',
        //   path: 'admin/user-approval',
        // },
      ];
      if(entityName.toLowerCase().includes('xnode')){
        this.sideMenuItems.push({
          label: 'Agents',
          icon: './assets/agent-hub/agent-sidebar.svg',
          path: 'agent-playground/',
        })
      }
      this.activateMenuItem();
    } else {
      const environmentName = environment.name as keyof typeof AppSideMenuItems;
      if (this.currentUser?.role_name === 'Xnode Admin') {
        this.sideMenuItems = AppSideMenuItems[environmentName].AdminSideMenu;
        this.selectedMenuIndex = 0;
      } else {
        this.sideMenuItems = AppSideMenuItems[environmentName].UserSideMenu;
      }
    }
  }

  activateMenuItem() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentPath = val.url;
        this.sideMenuItems.map((item: any, index: any) => {
          if ('/' + item.path === this.currentPath) {
            this.selectedMenuIndex = index;
          }
        });
      }
    });
  }

  onClickMenuItem(item: any, i: any): void {
    const isNaviExpanded = this.storageService.getItem(StorageKeys.IS_NAVI_EXPANDED)
    if (isNaviExpanded && (item.label === 'Home' || item.label === 'Agents')) {
      this.storageService.saveItem(StorageKeys.IS_NAVI_EXPANDED, false)
      this.navigateToHome.emit();
    } else {
      const product = this.storageService.getItem(StorageKeys.Product)
      if (!product || isNaviExpanded)
        this.enableDockedNavi.emit();
    }
    this.selectedMenuIndex = i;
    this.router.navigate(['/' + item.path]);
  }
}
