import { Component } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Router } from '@angular/router';
import { LAYOUT_COLUMNS } from 'src/app/constants/LayoutColumns';
import { UtilsService } from '../services/utils.service';
import { environment } from 'src/environments/environment';
import { SubMenuConfig } from 'src/app/constants/SubMeuItems';
import { User } from 'src/app/utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service';


@Component({
  selector: 'xnode-page-tools-layout',
  templateUrl: './page-tools-layout.component.html',
  styleUrls: ['./page-tools-layout.component.scss']
})
export class PageToolsLayoutComponent {
  isOpen = true;
  sideMenu: any;
  dashboard: Array<GridsterItem> | undefined;
  layoutColumns: any;
  href: any;
  sideMenuItem: any;
  selectedContainer: string = 'CONTAINER';
  iframeUrl: string = "http://localhost:54809/";
  activatedAccIndex = 1;
  currentUser?: User;

  constructor(private router: Router, private subMenuLayoutUtil: UtilsService, private auditUtil: AuditutilsService, public utils: UtilsService,) {
    if (environment.name === 'BETA') {
      this.sideMenu = SubMenuConfig.BETA
    } else {
      this.sideMenu = SubMenuConfig.DEV
    }
  }

  ngOnInit() {
    this.layoutColumns = LAYOUT_COLUMNS;
    this.dashboard = LAYOUT_COLUMNS.CONTAINER;
    this.subMenuLayoutUtil.openSubmenu.subscribe((data: any) => {
      this.isOpen = data;
    })
    this.loadSubMenu();
    if (this.router.url === '/configuration/workflow/overview') {
      this.activatedAccIndex = 6;
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.utils.EnablePageToolsLayoutSubMenu()
    } else {
      this.utils.disablePageToolsLayoutSubMenu()
    }
  }

  loadSubMenu() {
    this.sideMenu.forEach((item: any) => {
      if (item.path == this.router.url) {
        this.sideMenuItem = item;
      }
    });
    setTimeout(() => {
      this.sideSubMenu();
    }, 5000);
  }
  onClickSubMenuItem(subMenuItem: any) {
    if (subMenuItem.routerlink !== '') {
      this.router.navigate([subMenuItem.routerlink])
    }
  }
  onClickAccordian(item: any, index: number) {
    this.activatedAccIndex = index;
  }
  sideSubMenu() {
    if (this.sideMenu?.subMenuItems) {
      this.sideMenu?.subMenuItems?.forEach((item: any, i: any) => {
        item?.accordianContent?.forEach((innerItem: any, j: any) => {
          if (i == 0 && j == 0) {
            let category = item.accordianHeader;
            let innerCategory = innerItem.id;
            let contentElem = document.getElementById(category + innerCategory) as HTMLElement;
            if (contentElem) {
              contentElem.style.background = '#302e38';
            }
          }
        });
      });
    }
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
    this.sideMenuItem?.subMenuItems?.forEach((item: any) => {
      item?.accordianContent?.forEach((innerItem: any) => {

        let contentElem = document.getElementById(item.accordianHeader + innerItem.id) as HTMLElement;
        if (contentElem) {
          contentElem.style.background = '#24232c';
        }
      });
    });
    let idElem = document.getElementById(id) as HTMLElement;
    if (idElem) {
      this.auditUtil.postAudit(id, 1, 'SUCCESS', 'user-audit');
      idElem.style.background = '#302e38';
    }
  }
}
