import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { User, UserUtil } from 'src/app/utils/user-util';
import { ApiService } from 'src/app/api/api.service';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
@Component({
  selector: 'xnode-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.scss'],
  providers: [MessageService]
})

export class TemplateBuilderComponent implements OnInit {
  @Input() currentView: string = 'desktop';
  layoutColumns: any;
  isOpen = true;
  templates: any;
  product_id: any;
  iframeSrc: any;
  overview: any;
  id: String = '';
  email: any;
  selectedTemplate = localStorage.getItem("app_name");
  product: any;
  currentUser?: User;
  environment: any;
  userId: any;


  constructor(private sanitizer: DomSanitizer, private apiService: ApiService, private messageService: MessageService, private utils: UtilsService, private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
    this.email = this.currentUser?.email
    this.userId = this.currentUser?.user_id;
    this.environment = environment.name;
  }

  ngOnInit() {
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
      this.product_id = JSON.parse(product).id;
    }
    if (this.product && !this.product?.has_insights) {
      this.utils.showProductStatusPopup(true);
    }
    if (this.product_id) {
      this.makeTrustedUrl();
    } else {
      this.get_ID();
    }

  }
  makeTrustedUrl(): void {
    let rawUrl = environment.designStudioAppUrl + "?email=" + this.currentUser?.email + "&id=" + this.product_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + this.product?.has_insights + '&isVerified=true' + "&userId=" + this.userId;
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

          console.log('check me data event out', event)
          if (event.origin + '/dashboard/' !== environment.designStudioAppUrl) {
            if (event.data) {
              console.log('check me data event', event)
              let data = event.data;
              this.auditUtil.post(data.activityTypeId, data.attemptcount, data.attemptSuccess, 'user-audit', data.user_audit_body, data.userEmail, data.productId);
            }
            return;
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
    this.apiService.get('/get_metadata/' + this.currentUser?.email)
      .then((response: any) => {
        if (response) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_ID_GET_METADATA_TEMPLATE_BUILDER', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.product_id);
          this.product_id = response.data.data[0].id;
          localStorage.setItem("app_name", response.data.data[0].product_name)
          this.loadDesignStudio();
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('GET_ID_GET_METADATA_TEMPLATE_BUILDER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
          this.utils.loadToaster({ severity: 'error', summary: '', detail: 'Network error' });
        }
      }).catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.post('GET_ID_GET_METADATA_TEMPLATE_BUILDER', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.product_id);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: error, life: 3000 });
      });
  }

  loadDesignStudio() {
    let iframeSrc = environment.designStudioAppUrl + "?email=" + this.currentUser?.email + "&id=" + this.product_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + this.product?.has_insights + '&isVerified=true' + "&userId=" + this.userId;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(iframeSrc);
  }

  loadSpinner(event: boolean) {
    this.utils.loadSpinner(event);
  }
}