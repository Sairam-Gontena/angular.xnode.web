import { Component, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.email = JSON.parse(currentUser).email;
      this.get_Conversation();
    }
  }

  makeTrustedUrl(): void {
    // let email = 'admin@xnode.ai';
    let rawUrl = 'http://127.0.0.1:8000/?email=' + this.email +
      '&productContext=' + this.productContext +
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
    return localStorage.getItem('currentUser') === 'true' || window.location.hash === "#/configuration/data-model" || window.location.hash === "#/use-cases"
      || window.location.hash === "#/overview" || window.location.hash === "#/design" || window.location.hash === "#/operate";
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
