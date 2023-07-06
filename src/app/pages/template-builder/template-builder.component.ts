import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  HostListener,
  ViewEncapsulation,
  Input,
  ViewChild
} from '@angular/core';

import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType
} from 'angular-gridster2';
import { LAYOUT_COLUMNS } from '../../constants/LayoutColumns'
import { TemplateBuilderPublishHeaderComponent } from 'src/app/components/template-builder-publish-header/template-builder-publish-header.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'xnode-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.scss']
})

export class TemplateBuilderComponent implements OnInit {
  @ViewChild('childComponent') childComponent!: TemplateBuilderPublishHeaderComponent;
  @Input() currentView: string = 'desktop';
  options: GridsterConfig = {};
  dashboard: Array<GridsterItem> | undefined;
  layoutColumns: any;
  isOpen = true;
  templates: any;
  emailData: any;
  recordId: any;
  iframeSrc: any;
  selectedTemplate: string = 'FinBuddy';
  constructor(private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.templates = [
      { label: 'FinBuddy' }
    ]

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
    this.emailData = localStorage.getItem('currentUser');
    if (this.emailData) {
      let JsonData = JSON.parse(this.emailData)
      this.emailData = JsonData?.email;
    }
    this.recordId = localStorage.getItem('record_id');
    // http://localhost:4200/?email=admin@xnode.ai&id=89467239832783298
    let iframeSrc = "https://xnode-template-builder.azurewebsites.net/?email=" + this.emailData + "&id=" + this.recordId + "";
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);
  }

  onIconClicked(icon: string) {
    // Update the contentToShow property based on the icon clicked
    this.currentView = icon;
  }

}