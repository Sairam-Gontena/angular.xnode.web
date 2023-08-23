import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef } from 'jsplumb';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'xnode-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss']
})

export class NaviComponent implements OnInit {
  @ViewChild('myIframe') iframe?: ElementRef;
  constructor(
    private router: Router,
    private domSanitizer: DomSanitizer,) {
  }
  targetUrl: string = environment.naviAppUrl;
  safeUrl: SafeResourceUrl = '';
  xnodeAppUrl: string = environment.xnodeAppUrl;

  ngOnInit(): void {
    //get user data from local storage
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let data = {
      'email': email,
      'flag': 'x-pilot'
    }
    //get Iframe and receive data
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    this.targetUrl = this.targetUrl + '?email=' + email + '&xnode_flag=' + data.flag + '&targetUrl=' + environment.xnodeAppUrl;
    if (localStorage.getItem('record_id')) {
      this.targetUrl = this.targetUrl + '&productContext=' + localStorage.getItem('record_id');
    }
    // Needs to be refactor
    // Add a load event listener to the iframe
    iframe.addEventListener('load', () => {
      // Access the iframe's content window only when it has fully loaded
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        // Add an event listener to listen for messages from the iframe
        window.addEventListener('message', (event) => {
          console.log('event', event);

          // Check the origin of the message to ensure it's from the iframe's domain
          if (event.origin + '/' !== this.targetUrl.split('?')[0]) {

            return; // Ignore messages from untrusted sources
          }

          // Check the message content and trigger the desired event
          if (event.data === 'triggerCustomEvent' || event.data === 'close-docked-navi') {
            window.location.href = this.xnodeAppUrl + '#/my-products';
            // Trigger a custom event in the parent window
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
        });
        // Trigger the message to the iframe
        contentWindow.postMessage(data, this.targetUrl);
      }
    });
    this.makeTrustedUrl();
  }

  makeTrustedUrl(): void {
    this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

  onClickContinue(): void {
    this.router.navigate(['/dashboard']);
  }

}