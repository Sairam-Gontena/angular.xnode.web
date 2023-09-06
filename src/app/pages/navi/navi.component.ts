import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef } from 'jsplumb';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';

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
    private domSanitizer: DomSanitizer,) {
  }
  targetUrl: string = environment.naviAppUrl;
  safeUrl: SafeResourceUrl = '';
  xnodeAppUrl: string = environment.xnodeAppUrl;

  ngOnInit(): void {
    localStorage.removeItem('has_insights');
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let data = {
      'email': email,
      'flag': 'x-pilot'
    }
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    this.targetUrl = this.targetUrl + '?email=' + email + '&xnode_flag=' + data.flag + '&targetUrl=' + environment.xnodeAppUrl;
    if (localStorage.getItem('record_id')) {
      this.targetUrl = this.targetUrl + '&productContext=' + localStorage.getItem('record_id');
    }
    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        window.addEventListener('message', (event) => {
          if (event.origin + '/' !== this.targetUrl.split('?')[0]) {
            return;
          }
          if (event.data === 'triggerCustomEvent') {
            window.location.href = this.xnodeAppUrl + '#/my-products?product=created';
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
          if (event.data === 'close-event') {
            window.location.href = this.xnodeAppUrl + '#/my-products';
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
        });
        contentWindow.postMessage(data, this.targetUrl);
      }
    });
    this.makeTrustedUrl();
    this.utils.loadSpinner(false);
  }

  makeTrustedUrl(): void {
    this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

  onClickContinue(): void {
    this.router.navigate(['/dashboard']);
  }

}