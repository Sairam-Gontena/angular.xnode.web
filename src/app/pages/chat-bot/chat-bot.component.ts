import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    localStorage.clear();
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    // Needs to be refactor
    // Add a load event listener to the iframe
    iframe.addEventListener('load', () => {
      // Access the iframe's content window only when it has fully loaded
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        // Add an event listener to listen for messages from the iframe
        window.addEventListener('message', (event) => {
          window.location.href = "https://dev-angular-xnode.azurewebsites.net/#/overview";

          // Check the origin of the message to ensure it's from the iframe's domain
          if (event.origin !== 'https://xpilot.azurewebsites.net') {
            return; // Ignore messages from untrusted sources
          }

          // Check the message content and trigger the desired event
          if (event.data === 'triggerCustomEvent') {
            // Trigger a custom event in the parent window
            const customEvent = new Event('customEvent');
            window.dispatchEvent(customEvent);
          }
        });

        // Trigger the message to the iframe
        contentWindow.postMessage('triggerCustomEvent', 'https://xpilot.azurewebsites.net');
      }
    });
  }

  onClickContinue(): void {
    this.router.navigate(['/design']);
  }

}
