import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
@Component({
  selector: 'xnode-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.scss'],
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
    private auditUtil: AuditutilsService,
    private storageService: LocalStorageService
  ) {
    this.currentUser = UserUtil.getCurrentUser();
    this.email = this.currentUser?.email;
    this.userId = this.currentUser?.user_id;
    this.environment = environment.name;
  }

  ngOnInit() {
    this.getMeStorageData();
  }

  getMeStorageData(): void {
    this.product = this.storageService.getItem(StorageKeys.Product)
    console.log('this.product', this.product);

    if (this.product) {
      let productEmail =
        this.currentUser?.email === this.product?.owners[0]?.email
          ? this.currentUser?.email
          : this.product?.owners[0]?.email;
      this.rawUrl =
        environment.designStudioAppUrl +
        '?email=' +
        productEmail +
        '&id=' +
        this.product?.id +
        '&targetUrl=' +
        environment.xnodeAppUrl +
        '&isVerified=true' +
        '&userId=' +
        this.userId +
        '&embedded=true';
      const token = this.storageService.getItem(StorageKeys.ACCESS_TOKEN);
      if (token) {
        this.rawUrl = this.rawUrl + '&token=' + token;
      }
      console.log('  this.rawUrl', this.rawUrl);

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
        '&isVerified=true' +
        '&userId=' +
        this.userId +
        '&embedded=true';
      const token = this.storageService.getItem(StorageKeys.ACCESS_TOKEN);
      if (token) {
        this.rawUrl = this.rawUrl + '&token=' + token;
      }
      console.log('  this.rawUrl', this.rawUrl);

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
