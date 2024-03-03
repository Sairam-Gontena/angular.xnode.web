import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementRef } from 'jsplumb';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { AuthApiService } from 'src/app/api/auth.service';
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
  usersList: any;
  constructor(
    private router: Router,
    private utils: UtilsService,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private api: AuthApiService,
    private storageService: LocalStorageService
  ) { }
  targetUrl: string = environment.naviAppUrl;
  safeUrl: SafeResourceUrl = '';
  xnodeAppUrl: string = environment.xnodeAppUrl;
  currentUser: any;
  showProductStatusPopup = false;
  contentFromNavi = false;
  content: any;
  productDetails: any;
  productEmail: any;
  naviSummaryProduct: any
  iframeLoaded = false;

  ngOnInit(): void {
    this.utils.getMeSummaryObject.subscribe((data: any) => {
      this.naviSummaryProduct = data;
      if (this.iframeLoaded) {
        this.sendMessageToNavi(this.naviSummaryProduct);
      }
    })
    let queryParams: any;
    this.route.queryParams.subscribe((params: any) => {
      if (params) {
        queryParams = params;
      }
    })
    let currentUserDetails = localStorage.getItem('currentUser');
    let product = localStorage.getItem('product');
    if (product) {
      this.productDetails = JSON.parse(product);
    }
    if (currentUserDetails) {
      this.currentUser = JSON.parse(currentUserDetails);
    }
    if (this.productDetails?.email == this.currentUser?.email) {
      this.productEmail = this.currentUser?.email;
    } else {
      this.productEmail = this.productDetails?.email;
    }
    this.utils.disableDockedNavi()
    localStorage.removeItem('has_insights');
    localStorage.getItem('show-upload-panel');
    if (queryParams) {

    }
    this.getAllUsers(queryParams);
  }
  constructIframeUrl(queryParams: any) {
    const restriction_max_value = localStorage.getItem('restriction_max_value');
    let userData: any;
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let data = {
      email: email,
      flag: 'x-pilot',
    };
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    this.targetUrl =
      environment.naviAppUrl +
      '?email=' +
      this.currentUser?.email +
      '&targetUrl=' +
      environment.xnodeAppUrl +
      '&token=' +
      this.storageService.getItem(StorageKeys.ACCESS_TOKEN) +
      '&user_id=' +
      this.currentUser.user_id;
    this.targetUrl =
      this.targetUrl +
      '&productContext=' + (queryParams?.productId ? queryParams.productId :
        (localStorage.getItem('record_id')
          ? localStorage.getItem('record_id')
          : 'new_product'));
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
    if (this.usersList) {
      this.targetUrl = this.targetUrl + '&account_user_list=' + JSON.stringify(this.usersList);
    }
    if (this.naviSummaryProduct) {
      this.targetUrl = this.targetUrl + '&NaviSummaryProducxt=' + JSON.stringify(this.naviSummaryProduct);
    }

    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        window.addEventListener('message', (event) => {
          if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
            return;
          }
          if (event.data.message === 'triggerCustomEvent') {
            window.location.href =
              this.xnodeAppUrl + '#/my-products?product=created';
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
          if (event.data.message === 'viewSummary') {
            this.utils.viewSummary({ showViewSummary: true, product_id: event.data.product_id });

          }
          if (event.data.message === 'close-event') {
            this.utils.showLimitReachedPopup(false);
            window.location.href = this.xnodeAppUrl + '#/my-products';
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
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
        });
        contentWindow.postMessage(data, this.targetUrl);
      }
    });
    this.makeTrustedUrl();
    this.utils.loadSpinner(false);
  }
  getAllUsers(queryParams: any) {
    let accountId = this.currentUser.account_id
    if (accountId) {
      let params = {
        account_id: accountId
      }
      this.api.getUsersByAccountId(params).then((response: any) => {
        response.data.forEach((element: any) => { element.name = element.first_name + ' ' + element.last_name });
        this.usersList = response.data;
        this.constructIframeUrl(queryParams);
      })
    }
  }

  onIframeLoad() {
    this.iframeLoaded = true
    if (this.naviSummaryProduct) {
      this.sendMessageToNavi(this.naviSummaryProduct);
    }
  }

  sendMessageToNavi(data: any) {
    if (this.targetUrl && data) {
      window.frames[0].postMessage({
        NaviSummaryNotification: data
      }, this.targetUrl);
    }
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

  ngOnDestroy(): void {
    this.naviSummaryProduct = null;
    this.utils.updateSummary({});
    this.iframeLoaded = false;
  }
}
