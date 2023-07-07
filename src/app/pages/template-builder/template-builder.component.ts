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
import { environment } from 'src/environments/environment';

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
  selectedTemplate = localStorage.getItem("app_name");
  constructor(private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.templates = [
      { label: localStorage.getItem("app_name") }
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
    let iframeSrc = environment.designStudioUrl + "?email=" + this.emailData + "&id=" + this.recordId + "";
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);
  }

  onIconClicked(icon: string) {
    // Update the contentToShow property based on the icon clicked
    this.currentView = icon;
  }

}