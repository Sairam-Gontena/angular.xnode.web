import { Component, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'xnode';
  botOutput = ['false'];
  isSideWindowOpen: boolean = false;
  email: String = '';
  id: String = '';
  sideWindow: any = document.getElementById('side-window');
  productContext: string | null = '';
  iframeUrl: SafeResourceUrl = '';

  constructor(
    private domSanitizer: DomSanitizer,
    private apiService: ApiService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getUserData();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouterChange();
      }
    });
  }

  handleRouterChange() {
    this.isSideWindowOpen = false;
  }

  getUserData() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser && localStorage.getItem('record_id')) {
      this.email = JSON.parse(currentUser).email;
      this.get_Conversation();
    }
  }

  makeTrustedUrl(): void {
    let rawUrl = environment.xpilotUrl + '?email=' + this.email +
      '&productContext=' + localStorage.getItem('record_id') +
      '&targetUrl=' + environment.baseUrl +
      '&xnode_flag=' + 'XNODE-APP';
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  get_Conversation() {
    this.apiService.get("/get_conversation/" + this.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = response?.data;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  isUserExists() {
    // Temporary
    return window.location.hash === "#/configuration/data-model" || window.location.hash === "#/use-cases"
      || window.location.hash === "#/overview" || window.location.hash === "#/design" || window.location.hash === "#/operate" || window.location.hash === "#/publish";
  }

  addItem(newItem: any) {
    this.botOutput.push(newItem.toString());
    this.isSideWindowOpen = newItem.cbFlag;
    this.productContext = newItem.productContext;
    this.makeTrustedUrl();
  }

  toggleSideWindow() {
    this.isSideWindowOpen = !this.isSideWindowOpen;
  }

  submenuFunc() {
    this.apiService.falseOpen()
  }

  closeSideWindow() {
    this.isSideWindowOpen = false;
  }

  parentdata: any[] = [
    {
      Name: "Thimma chowdary",
      Age: 25,
      Address: "Address1",
      Email: 'thimma@gmail.comm'
    },
    {
      Name: "Thimma1",
      Age: 26,
      Address: "Address12",
      Email: 'thimma@gmail.comm'

    },
    {
      Name: "Thimma1",
      Age: 26,
      Address: "Address12",
      Email: 'thimma@gmail.comm'

    },
  ]

}
