import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import {
  CompactType,
  GridsterConfig,
  GridsterItem,
  GridType
} from 'angular-gridster2';
import { LAYOUT_COLUMNS } from '../../constants/LayoutColumns'
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/utils/user-util';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.scss']
})

export class TemplateBuilderComponent implements OnInit {
  @Input() currentView: string = 'desktop';
  options: GridsterConfig = {};
  dashboard: Array<GridsterItem> | undefined;
  layoutColumns: any;
  isOpen = true;
  templates: any;
  emailData: any;
  recordId: any;
  iframeSrc: any;
  currentUser?: User;
  overview: any;
  id: String = '';
  loading = true;
  email = '';
  selectedTemplate = localStorage.getItem("app_name");

  constructor(private sanitizer: DomSanitizer, private apiService: ApiService) {

  }

  ngOnInit() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

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
    if (localStorage.getItem('record_id')) {
      this.recordId = localStorage.getItem('record_id');
      let iframeSrc = environment.designStudioUrl + "?email=" + this.emailData + "&id=" + this.recordId + "";
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);
    } else {
      this.get_ID();
    }

  }

  onIconClicked(icon: string) {
    // Update the contentToShow property based on the icon clicked
    this.currentView = icon;
  }

  get_ID() {
    this.apiService.getID(this.emailData)
      .then(response => {
        this.recordId = response.data.data[0].id;
        localStorage.setItem("app_name", response.data.data[0].title)
        this.loadDesignStudio()
        this.loading = false;
      }).catch(error => {
        console.log(error);
        this.loading = false;
      });
  }

  loadDesignStudio() {
    let iframeSrc = environment.designStudioUrl + "?email=" + this.emailData + "&id=" + this.recordId + "";
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);
  }
}