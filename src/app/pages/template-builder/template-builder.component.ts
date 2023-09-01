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
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.scss'],
  providers: [MessageService]
})

export class TemplateBuilderComponent implements OnInit {
  @Input() currentView: string = 'desktop';
  options: GridsterConfig = {};
  dashboard: Array<GridsterItem> | undefined;
  layoutColumns: any;
  isOpen = true;
  templates: any;
  emailData: any;
  productId: any;
  iframeSrc: any;
  currentUser?: User;
  overview: any;
  id: String = '';
  loading = true;
  email = '';
  selectedTemplate = localStorage.getItem("app_name");

  constructor(private sanitizer: DomSanitizer, private apiService: ApiService, private messageService: MessageService, private utils: UtilsService) {
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
    if (localStorage.getItem('record_id')) {
      this.productId = localStorage.getItem('record_id');
      this.makeTrustedUrl();
      this.loading = false;
    } else {
      this.get_ID();
    }

  }
  makeTrustedUrl(): void {
    let rawUrl = environment.designStudioAppUrl + "?email=" + this.emailData + "&id=" + this.productId + "&targetUrl=" + environment.xnodeAppUrl;
    setTimeout(() => {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);;
      this.loadIframeUrl();
    }, 2000);
  }

  loadIframeUrl(): void {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        window.addEventListener('message', (event) => {
          console.log('event.origin ', event.origin);
          console.log('environment.designStudioAppUrl', environment.designStudioAppUrl);
          if (event.origin + '/dashboard/' !== environment.designStudioAppUrl) {
            return;
          }
          if (event.data === 'product_status') {
            this.utils.showProductStatusPopup(true);
          }
        });
      }
    });
  }


  onIconClicked(icon: string) {
    // Update the contentToShow property based on the icon clicked
    this.currentView = icon;
  }

  get_ID() {
    this.apiService.get('/get_metadata/' + this.emailData)
      .then(response => {
        if (response) {
          this.productId = response.data.data[0].id;
          localStorage.setItem("app_name", response.data.data[0].product_name)
          this.loadDesignStudio();
        } else {
          this.utils.loadToaster({ severity: 'error', summary: '', detail: 'Network error' });
        }
      }).catch(error => {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: error, life: 3000 });
      });
  }

  loadDesignStudio() {
    let iframeSrc = environment.designStudioAppUrl + "?email=" + this.emailData + "&id=" + this.productId + "&targetUrl=" + environment.xnodeAppUrl;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);
  }

  loadSpinner(event: boolean): void {
    this.loading = event;
  }
}