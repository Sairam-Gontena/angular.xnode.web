import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElementRef } from 'jsplumb';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'xnode-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {
  @ViewChild('myIframe') iframe?: ElementRef;

  constructor(
    private router: Router,
    private domSanitizer: DomSanitizer,) {
  }

  targetUrl: string = 'https://xpilot.azurewebsites.net';
  // targetUrl: string = 'http://127.0.0.1:8000/';
  safeUrl: SafeResourceUrl ='';
  baseUrl: string = 'https://dev-angular-xnode.azurewebsites.net/';
  // baseUrl: string = 'http://localhost:4200/';

  ngOnInit(): void {
     //get user data from local storage
    let userData : any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let data = {
      'email':email,
      'flag':'x-pilot'
    }

    //get Iframe and receive data
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
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
          if (event.origin !== this.targetUrl) {
            return; // Ignore messages from untrusted sources
          }

          // Check the message content and trigger the desired event
          if (event.data === 'triggerCustomEvent') {
            window.location.href = this.baseUrl+'#/overview';

            // Trigger a custom event in the parent window
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
        });

        // Trigger the message to the iframe
        contentWindow.postMessage(data, this.targetUrl);
      }
    });
  }

  makeTrustedUrl(): void {
    this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

  onClickContinue(): void {
    this.router.navigate(['/design']);
  }

}
