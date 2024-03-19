import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { User, UserUtil } from 'src/app/utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { ElementRef } from 'jsplumb';
@Component({
  selector: 'xnode-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.scss'],
  providers: [MessageService],
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
  selectedTemplate = localStorage.getItem('app_name');
  product: any;
  currentUser?: User;
  environment: any;
  userId: any;
  rawUrl: any;

  constructor(
    private sanitizer: DomSanitizer,
    private utils: UtilsService,
    private auditUtil: AuditutilsService
  ) {
    this.currentUser = UserUtil.getCurrentUser();
    this.email = this.currentUser?.email;
    this.userId = this.currentUser?.user_id;
    this.environment = environment.name;
  }

  ngOnInit() {
    this.getMeStorageData();

    this.sendHeaderHeightToIframe();
  }


  // @ViewChild('headerElement') headerElement!: ElementRef;

  sendHeaderHeightToIframe(): void {
    debugger
    const remainingHeight = this.getHeaderHeight();
    console.log("remainingHeight", remainingHeight)
    setTimeout(() => {
      const iframeWindow = document.getElementById('myIframe') as HTMLIFrameElement;
    if (iframeWindow) {
      iframeWindow.contentWindow?.postMessage({ remainingHeight }, '*');
    }
    }, 1000);
  }

  getHeaderHeight() {
    const headerElement = document.querySelector('.publish-header')
    let remainingHeight = window.innerHeight
    if(headerElement) {
      remainingHeight = remainingHeight - headerElement?.getBoundingClientRect()?.top ?? 0 - headerElement.clientHeight
    }

    return remainingHeight
  }

  getMeStorageData(): void {
    const product = localStorage.getItem('product');
    let productDetails;
    if (product) {
      productDetails = JSON.parse(product);
    }
    if (product) {
      this.product = JSON.parse(product);
      this.product_id = JSON.parse(product).id;
    }
    if (this.product && !this.product?.has_insights) {
      this.utils.showProductStatusPopup(true);
    }
    if (this.product_id) {
      let productEmail =
        this.currentUser?.email == productDetails?.email
          ? this.currentUser?.email
          : productDetails?.email;
      this.rawUrl =
        environment.designStudioAppUrl +
        '?email=' +
        productEmail +
        '&id=' +
        this.product_id +
        '&targetUrl=' +
        environment.xnodeAppUrl +
        '&has_insights=' +
        this.product?.has_insights +
        '&isVerified=true' +
        '&userId=' +
        this.userId +
        '&embedded=true';
      this.makeTrustedUrl();
    } else {
      this.product_id = localStorage.getItem('record_id');
      this.rawUrl =
        environment.designStudioAppUrl +
        '?email=' +
        this.currentUser?.email +
        '&id=' +
        this.product_id +
        '&targetUrl=' +
        environment.xnodeAppUrl +
        '&has_insights=' +
        true +
        '&isVerified=true' +
        '&userId=' +
        this.userId +
        '&embedded=true';
      this.makeTrustedUrl();
    }
  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
    this.loadIframeUrl();
  }

  loadIframeUrl(): void {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        window.addEventListener('message', (event) => {
          if (event.origin + '/dashboard/' !== environment.designStudioAppUrl) {
            return;
          }
          if (event.data.message == 'retrive_dashboard_generic_screen') {
            let data = event.data.data;
            if (
              !data?.type &&
              data !== 'expand-navi' &&
              data !== 'contract-navi'
            )
              this.auditUtil.postAudit(
                data.activityTypeId,
                data.attemptcount,
                data.attemptSuccess,
                'user-audit',
                data.user_audit_body,
                data.userEmail,
                data.productId
              );
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
  onChangeProduct(obj: any): void {
    localStorage.setItem('record_id', obj?.id);
    localStorage.setItem('app_name', obj.title);
    localStorage.setItem(
      'product_url',
      obj.url && obj.url !== '' ? obj.url : ''
    );
    localStorage.setItem('product', JSON.stringify(obj));
    this.getMeStorageData();
  }
}
