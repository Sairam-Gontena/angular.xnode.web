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

    // if (this.href.includes('design')) {
    //   label = "Design";
    // } else if (this.href.includes('data-model')) {
    //   label = "Config";
    // } else if (this.href.includes('publish')) {
    //   label = "Publish";
    // } else {
    //   label = "Operate";
    // }
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
}
