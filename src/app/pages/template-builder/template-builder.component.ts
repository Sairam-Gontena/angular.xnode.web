import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType
} from 'angular-gridster2';

@Component({
  selector: 'xnode-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.scss']
})

export class TemplateBuilderComponent implements OnInit {
  options: GridsterConfig = {};
  dashboard: Array<GridsterItem> | undefined;

  constructor() { }

  ngOnInit() {
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

    this.dashboard = [
      { cols: 5, rows: 1, y: 0, x: 0 },
      { cols: 2, rows: 1, y: 0, x: 2 },
      { cols: 2, rows: 1, y: 0, x: 4 },
      { cols: 2, rows: 1, y: 1, x: 0 },
      { cols: 2, rows: 1, y: 1, x: 0 },
      { cols: 2, rows: 1, y: 2, x: 2 },
      { cols: 2, rows: 1, y: 2, x: 4 }
    ];
  }

}