import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ApiService } from './api/api.service';

@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // @ViewChild('myIframe') iframeRef !: ElementRef;

  title = 'xnode';
  botOutput = ['false'];
  isSideWindowOpen: boolean = false;
  email : String = 'admin@xnode.ai';
  id : String = '';
  sideWindow: any = document.getElementById('side-window');

  constructor(private router : Router, private apiService : ApiService) {

  }

  ngOnInit(): void {

    this.get_id();
    // this.get_Conversation();
    
  }

  get_id() {
    this.apiService.get("/get_metadata/" + this.email)
      .then(response => {
        if (response?.status === 200) {
          const data = response?.data?.data[0];
          this.id = data.id;
          // this.id = Array.isArray(data) ? data[0].Usecase : [];
        }
        // this.loading = false;
        console.log(this.id, response)
      })
      .catch(error => {
        console.log(error);

        // this.loading = false;
      });

  }

  get_Conversation(){
    this.apiService.get("/get_conversation/" + this.email + "/" + this.id)
      .then(response => {
        if (response?.status === 200) {
          const data = response?.data;
          // this.id = data.id;
          // this.id = Array.isArray(data) ? data[0].Usecase : [];
          console.log(data, response)
        }
        // this.loading = false;
        
      })
      .catch(error => {
        console.log(error);

        // this.loading = false;
      });
  }

  isUserExists() {
    // Temporary
    return localStorage.getItem('currentUser') === 'true' || window.location.hash === "#/configuration/data-model" || window.location.hash === "#/use-cases"
      || window.location.hash === "#/overview" || window.location.hash === "#/design" || window.location.hash === "#/operate";
  }

  addItem(newItem : boolean){
    this.botOutput.push(newItem.toString());
    this.isSideWindowOpen = newItem;
    console.log(this.botOutput);
  }
  sendDataToIframe(data: any){
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    if(iframe.contentWindow){
      console.log("this is iframe content Window, content doc",iframe.contentDocument, iframe.contentWindow);
      iframe.contentWindow.postMessage(data, "http://127.0.0.1:8000/");
      console.log("FINISHED Transaction")
    }
  }

  hideSideWindow(){}
  toggleSideWindow() {
    // this.sideWindow.style.display = '';
    this.isSideWindowOpen = !this.isSideWindowOpen;
    console.log(this.id);
    console.log(this.get_Conversation());
    this.sendDataToIframe("This is ashish. Lets create something");
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
