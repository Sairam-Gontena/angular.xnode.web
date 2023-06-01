import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppSideMenuItems } from 'src/app/constants/AppSideMenuItems';
import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType
} from 'angular-gridster2';
import { LAYOUT_COLUMNS } from '../../constants/LayoutColumns'
@Component({
  selector: 'xnode-template-side-menu',
  templateUrl: './template-side-menu.component.html',
  styleUrls: ['./template-side-menu.component.scss']
})
export class TemplateSideMenuComponent {
  menuItems: any[];
  options: GridsterConfig = {};
  dashboard: Array<GridsterItem> | undefined;
  layoutColumns: any;
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
 

  ngOnInit() {
    this.layoutColumns = LAYOUT_COLUMNS;
    this.dashboard = LAYOUT_COLUMNS.CONTAINER;
    this.options = {
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      maxCols: 6,
      maxRows: 10,
      resizable: {
        enabled: true
      },
      pushItems: true,
      draggable: {
        enabled: true
      }
    };
  }

  getLayout(layout: string): void {
    console.log('layout', layout);
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }
}
