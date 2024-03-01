import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementRef } from 'jsplumb';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';

@Component({
  selector: 'xnode-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss'],
})
export class NaviComponent implements OnInit {
  @ViewChild('myIframe') iframe?: ElementRef;
  templates: any;
  constructor(
    private router: Router,
    private utils: UtilsService,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute
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
    this.currentUser = localStorage.getItem('currentUser');
    let product = localStorage.getItem('product');
    if (product) {
      this.productDetails = JSON.parse(product);
    }
    const restriction_max_value = localStorage.getItem('restriction_max_value');
    if (this.currentUser) {
      this.currentUser = JSON.parse(this.currentUser);
    }
    if (this.productDetails?.email == this.currentUser?.email) {
      this.productEmail = this.currentUser?.email;
    } else {
      this.productEmail = this.productDetails?.email;
    }
    this.utils.disableDockedNavi()
    localStorage.removeItem('has_insights');
    localStorage.getItem('show-upload-panel');
    let userData: any;
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let data = {
      email: email,
      flag: 'x-pilot',
    };
    if (queryParams) {

    }
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    this.targetUrl =
      this.targetUrl +
      '?email=' +
      email +
      '&xnode_flag=' +
      data.flag +
      '&targetUrl=' +
      environment.xnodeAppUrl +
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
    if (this.productDetails?.email !== this.currentUser?.email) {
      this.targetUrl =
        this.targetUrl + '&product_user_email=' + this.productEmail;
    } else {
      this.targetUrl = this.targetUrl + '&product_user_email=' + email;
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
          if (event.data.message === 'import-file-popup') {
            this.utils.showImportFilePopup(true);
          }
        });
        contentWindow.postMessage(data, this.targetUrl);
      }
    });
    this.makeTrustedUrl();
    this.utils.loadSpinner(false);
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
