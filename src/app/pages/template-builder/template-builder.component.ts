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
  rawUrl: any;

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
      this.rawUrl = environment.designStudioAppUrl + "?email=" + this.currentUser?.email + "&id=" + this.product_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + this.product?.has_insights + '&isVerified=true' + "&userId=" + this.userId;
      this.makeTrustedUrl();
    } else {
      this.product_id = localStorage.getItem('record_id');
      this.rawUrl = environment.designStudioAppUrl + "?email=" + this.currentUser?.email + "&id=" + this.product_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + this.userId;
      this.makeTrustedUrl();
    }
  }
  makeTrustedUrl(): void {
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);;
    this.loadIframeUrl();
  }

  loadIframeUrl(): void {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        window.addEventListener('message', (event) => {
          if (event.data) {
            let data = event.data;
            if (!data?.type)
              this.auditUtil.post(data.activityTypeId, data.attemptcount, data.attemptSuccess, 'user-audit', data.user_audit_body, data.userEmail, data.productId);
          }
          if (event.origin + '/dashboard/' !== environment.designStudioAppUrl) {
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

  loadSpinner(event: boolean) {
    this.utils.loadSpinner(event);
  }
}