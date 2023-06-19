import { Component, OnInit } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { LayoutElementsComponent } from '../layout-elements/layout-elements.component';
import { LAYOUT_COLUMNS } from 'src/app/constants/LayoutColumns';
@Component({
  selector: 'xnode-page-tools-layout',
  templateUrl: './page-tools-layout.component.html',
  styleUrls: ['./page-tools-layout.component.scss']
})
export class PageToolsLayoutComponent {

  dashboard: Array<GridsterItem> | undefined;
  layoutColumns: any;
  ngOnInit() {
    this.layoutColumns = LAYOUT_COLUMNS;
    this.dashboard = LAYOUT_COLUMNS.CONTAINER;
  }
  getLayout(layout: string): void {
    console.log('layout', layout);
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }
}
