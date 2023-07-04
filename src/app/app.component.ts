import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ApiService } from './api/api.service';
import { selector } from 'd3';
import axios from 'axios';
import { HttpHeaders } from '@angular/common/http';

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
  
  async sendDataToIframe(data: String): Promise<void> {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
    // Needs to be refactor
    // Add a load event listener to the iframe
    console.log("Hi IFRAME")
    // const response = await axios({
    //     method: 'post',
    //     url: "http://127.0.0.1:8000/xnode",
    //     data: "this is from Xnode",
    //     headers: {
    //         'Content-Type': `multipart/form-data; `,
    //     },
    // });
      // Access the iframe's content window only when it has fully loaded
      const contentWindow = iframe.contentWindow;
      if (contentWindow) {
        console.log("in Postmessage")
        contentWindow.postMessage("admin@xnode.ai", "*");
        console.log("iFrame window content", contentWindow);
      }
   
  }

  hideSideWindow(){
    
  }
  toggleSideWindow() {
    // this.sideWindow.style.display = '';
    this.isSideWindowOpen = !this.isSideWindowOpen;
    console.log(this.id);
    // console.log(this.get_Conversation());
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
