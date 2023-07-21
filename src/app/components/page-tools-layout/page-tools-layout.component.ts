import { Component } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Router } from '@angular/router';
import { LAYOUT_COLUMNS } from 'src/app/constants/LayoutColumns';
import * as sidemenu from '../../../assets/json/sidemenu-tools.json';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'xnode-page-tools-layout',
  templateUrl: './page-tools-layout.component.html',
  styleUrls: ['./page-tools-layout.component.scss']
})
export class PageToolsLayoutComponent {
  isOpen = false;
  sideMenu = sidemenu?.subMenuConfig;
  dashboard: Array<GridsterItem> | undefined;
  layoutColumns: any;
  href: any;
  sideMenuItem: any = [];
  selectedContainer: string = 'CONTAINER';
  iframeUrl: string = "http://localhost:54809/";

  constructor(private router: Router, private apiService: ApiService, private subMenuLayoutUtil: UtilsService) {
  }

  ngOnInit() {
    this.layoutColumns = LAYOUT_COLUMNS;
    this.dashboard = LAYOUT_COLUMNS.CONTAINER;
    this.subMenuLayoutUtil.openSubmenu.subscribe((data: any) => {
      this.isOpen = data;
    })
    this.loadSubMenu();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  loadSubMenu() {
    this.sideMenu.forEach((item: any) => {
      if (item.path == this.router.url) {
        this.sideMenuItem = item;
      }
    });
    setTimeout(() => {
      this.sideMenuItem.subMenuItems.map((item: any, i: any) => {
        item.accordianContent.map((innerItem: any, j: any) => {
          if (i == 0 && j == 0) {
            let category = item.accordianHeader;
            let innerCategory = innerItem.id;
            console.log(category + innerCategory)
            let contentElem = document.getElementById(category + innerCategory) as HTMLElement;
            contentElem.style.background = '#302e38';
          }
        });
      });
    }, 10000);
  }

  getLayout(layout: string): void {
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }

  drag(ev: any) {
    ev.dataTransfer?.setData('text/plain', ev.target.id);
    window.frames[0].postMessage({
      type: 'dragItem', itemId: ev.target.id
    }, this.iframeUrl);
  }

  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drop(ev: any) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

  selectedSubMenu(id: any) {
    this.sideMenuItem.subMenuItems.map((item: any) => {
      let category = item.accordianHeader;
      item.accordianContent.map((innerItem: any) => {
        let contentElem = document.getElementById(item.accordianHeader + innerItem.id) as HTMLElement;
        contentElem.style.background = '#24232c';
      });
    });
    let idElem = document.getElementById(id) as HTMLElement;
    idElem.style.background = '#302e38';
  }
}
