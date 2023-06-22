import { Component, OnInit } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Router } from '@angular/router';
import { LayoutElementsComponent } from '../layout-elements/layout-elements.component';
import { LAYOUT_COLUMNS } from 'src/app/constants/LayoutColumns';
import * as sidemenu from '../../../assets/json/sidemenu-tools.json';

@Component({
  selector: 'xnode-page-tools-layout',
  templateUrl: './page-tools-layout.component.html',
  styleUrls: ['./page-tools-layout.component.scss']
})
export class PageToolsLayoutComponent {
  sideMenu = sidemenu?.sidemenu;
  dashboard: Array<GridsterItem> | undefined;
  layoutColumns: any;
  href: any;
  sideMenuItem: any = [];
  selectedContainer: string = 'CONTAINER';

  iframeUrl: string = "http://localhost:54809/";

  constructor(private router: Router) {
    this.href = this.router.url;
    let label;
    if (this.href.includes('design')) {
      label = "Design";
    } if (this.href.includes('data-model')) {
      label = "Config";
    } if (this.href.includes('publish')) {
      label = "publish";
    }
    this.loadSubSideMenu(label);
  }

  ngOnInit() {
    this.layoutColumns = LAYOUT_COLUMNS;
    this.dashboard = LAYOUT_COLUMNS.CONTAINER;
  }

  async loadSubSideMenu(sidemenuLabel: any) {
    await this.sideMenu.filter((item: any) => {
      if (item?.Label == sidemenuLabel) {
        this.sideMenuItem.push(item);
      }
    });
    console.log(this.sideMenuItem)
  }

  getLayout(layout: string): void {
    console.log('layout', layout);
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
