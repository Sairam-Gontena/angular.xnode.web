import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef } from 'jsplumb';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss'],
})
export class NaviComponent implements OnInit {
  @ViewChild('myIframe') iframe?: ElementRef;
  product: any;
  templates: any;
  constructor(
    private router: Router,
    private utils: UtilsService,
    private domSanitizer: DomSanitizer,
    private storageService: LocalStorageService
  ) { }
  targetUrl: string = environment.naviAppUrl;
  safeUrl: SafeResourceUrl = '';
  xnodeAppUrl: string = environment.xnodeAppUrl;
  currentUser: any;
  showProductStatusPopup = false;
  contentFromNavi = false;
  content: any;

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.utils.disableDockedNavi();
    this.handleStorageData();
  }

  handleStorageData(): void {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    localStorage.removeItem('has_insights');
    localStorage.getItem('show-upload-panel');
    this.prepareIframeAndUrl();
  }

  prepareIframeAndUrl(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    const restriction_max_value = localStorage.getItem('restriction_max_value');
    this.targetUrl =
      environment.naviAppUrl +
      '?email=' +
      this.currentUser?.email +
      '&targetUrl=' +
      environment.xnodeAppUrl +
      '&token=' +
      this.storageService.getItem(StorageKeys.ACCESS_TOKEN) +
      '&user_id=' +
      this.currentUser?.user_id;
    if (localStorage.getItem('show-upload-panel')) {
      this.targetUrl = this.targetUrl + '&import=true';
    }
    if (restriction_max_value) {
      this.targetUrl =
        this.targetUrl +
        '&restriction_max_value=' +
        JSON.parse(restriction_max_value);
    }
    if (this.product) {
      this.targetUrl =
        this.targetUrl +
        '&product_user_email=' +
        this.product.email +
        +'&has_insights=' +
        this.product?.has_insights +
        '&product_context=' +
        true +
        '&product_id=' +
        this.product.id +
        '&product=' +
        JSON.stringify(this.product);
    }
    this.loadIframe();
  }

  loadIframe(): void {
    let data = {
      email: this.currentUser.email,
      flag: 'x-pilot',
    };
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        window.addEventListener('message', (event) => {
          this.emitIframeComponentEvents(event);
        });
        contentWindow.postMessage(data, this.targetUrl);
      }
    });
    this.makeTrustedUrl();
    this.utils.loadSpinner(false);
  }

  emitIframeComponentEvents(event: any): void {
    console.log('eventevent', event);

    if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
      return;
    }
    if (event.data.message === 'triggerCustomEvent') {
      window.location.href = this.xnodeAppUrl + '#/my-products?product=created';
      const customEvent = new Event('customEvent');
      window.dispatchEvent(customEvent);
    }
    if (event.data.message === 'close-event') {
      this.utils.showLimitReachedPopup(false);
      window.location.href = this.xnodeAppUrl + '#/my-products';
      const customEvent = new Event('customEvent');
      window.dispatchEvent(customEvent);
    }
    if (event.data.message === 'close-docked-navi') {
      this.utils.productContext(false);
      this.router.navigate(['/my-products']);
    }
    if (event.data.message === 'change-app') {
      console.log('?????');
      this.storageService.saveItem(StorageKeys.Product, event.data.data);
      this.utils.productContext(true);
    }
    if (event.data.message === 'file-uploaded') {
      localStorage.removeItem('show-upload-panel');
    }
    if (event.data.message === 'app-limit-exceeded') {
      this.utils.showLimitReachedPopup(true);
    }
    if (event.data.message === 'triggerProductPopup') {
      this.content = event?.data?.data;
      let data = {
        popup: true,
        data: this.content,
      };
      this.showProductStatusPopup = true;
      this.utils.toggleProductAlertPopup(data);
      event.stopImmediatePropagation();
    }
    if (event.data.message === 'triggerRouteToMyProducts') {
      const itemId = event.data.id;
      localStorage.setItem('record_id', itemId);
      this.utils.saveProductId(itemId);
      const metaData = localStorage.getItem('meta_data');
      if (metaData) {
        this.templates = JSON.parse(metaData);
        const product = this.templates?.filter((obj: any) => {
          return obj.id === itemId;
        })[0];
        localStorage.setItem('app_name', product.title);
        localStorage.setItem(
          'product_url',
          product.url && product.url !== '' ? product.url : ''
        );
        localStorage.setItem('product', JSON.stringify(product));
      }
      const newUrl = this.xnodeAppUrl + '#/dashboard';
      window.location.href = newUrl;
    }
    if (event.data.message === 'help-center') {
      window.location.href = this.xnodeAppUrl + '#/help-center';
    }
  }

  closePopup() {
    this.showProductStatusPopup = false;
  }

  makeTrustedUrl(): void {
    this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.targetUrl
    );
  }

  onClickContinue(): void {
    this.router.navigate(['/dashboard']);
  }
}
