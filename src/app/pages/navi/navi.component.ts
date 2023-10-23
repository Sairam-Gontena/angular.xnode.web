import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef } from 'jsplumb';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';

@Component({
  selector: 'xnode-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss']
})

export class NaviComponent implements OnInit {
  @ViewChild('myIframe') iframe?: ElementRef;
  constructor(
    private router: Router,
    private utils: UtilsService,
    private domSanitizer: DomSanitizer) {
  }
  targetUrl: string = environment.naviAppUrl;
  safeUrl: SafeResourceUrl = '';
  xnodeAppUrl: string = environment.xnodeAppUrl;
  currentUser: any
  showProductStatusPopup: boolean = false;
  content: any;
  productDetails: any;
  productEmail: any;

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser');
    let product = localStorage.getItem('product');
    if (product) {
      this.productDetails = JSON.parse(product);
    }
    console.log('check true', this.showProductStatusPopup)
    const restriction_max_value = localStorage.getItem('restriction_max_value')
    if (this.currentUser) {
      this.currentUser = JSON.parse(this.currentUser)
    }
    if (this.productDetails?.email == this.currentUser?.email) {
      this.productEmail = this.currentUser?.email;
    } else {
      this.productEmail = this.productDetails?.email;
    }
    localStorage.removeItem('has_insights');
    localStorage.getItem('show-upload-panel')
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let data = {
      'email': email,
      'flag': 'x-pilot'
    }
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    this.targetUrl = this.targetUrl + '?email=' + email + '&xnode_flag=' + data.flag + '&targetUrl=' + environment.xnodeAppUrl + '&user_id=' + this.currentUser.user_id;
    if (localStorage.getItem('record_id')) {
      this.targetUrl = this.targetUrl + '&productContext=' + localStorage.getItem('record_id');
    }
    if (localStorage.getItem('show-upload-panel')) {
      this.targetUrl = this.targetUrl + '&import=true';
    }
    if (restriction_max_value) {
      this.targetUrl = this.targetUrl + '&restriction_max_value=' + JSON.parse(restriction_max_value);
    }
    if (this.productDetails?.email !== this.currentUser?.email) {
      this.targetUrl = this.targetUrl + '&product_user_email=' + this.productEmail;
    } else {
      this.targetUrl = this.targetUrl + '&product_user_email=' + email;
    }
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        window.addEventListener('message', (event) => {
          if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
            return;
          }
          if (event.data.message === 'triggerCustomEvent') {
            window.location.href = this.xnodeAppUrl + '#/my-products?product=created';
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
          if (event.data.message === 'close-event') {
            this.utils.showLimitReachedPopup(false)
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
            this.content = { ...event?.data?.data };
            console.log('time - ', new Date().getMilliseconds())
            console.log('true or false', this.showProductStatusPopup)
            console.log('data at navi', this.content)
            this.showProductStatusPopup = true;
            this.utils.toggleProductAlertPopup(true);
            event.stopImmediatePropagation()
            console.log('coming or not')
          }
          if (event.data.message === 'triggerRouteToMyProducts') {
            const itemId = event.data.id;
            localStorage.setItem('record_id', itemId);
            this.utils.saveProductId(itemId);
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
    console.log('check true', this.showProductStatusPopup)
    this.utils.loadSpinner(false);
  }

  closePopup() {
    this.showProductStatusPopup = false
  }

  makeTrustedUrl(): void {
    this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

  onClickContinue(): void {
    this.router.navigate(['/dashboard']);
  }

}