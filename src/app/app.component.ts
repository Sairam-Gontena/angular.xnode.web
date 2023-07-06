import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ApiService } from './api/api.service';
import { selector } from 'd3';
import axios from 'axios';
import { HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'xnode';
  botOutput = ['false'];
  isSideWindowOpen: boolean = false;
  email : String = '';
  id : String = '';
  sideWindow: any = document.getElementById('side-window');
  productContext: string | null = '';
  iframeUrl : SafeResourceUrl = '';

  constructor(
    private router : Router, 
    private domSanitizer: DomSanitizer,
    private apiService : ApiService) 
    {

  }

  ngOnInit(): void {

    this.get_id();
    this.getUserData();
    
  }

  getUserData(){
    let currentUser = localStorage.getItem('currentUser');
    if(currentUser){
      this.email = JSON.parse(currentUser).email;
      console.log(currentUser, this.email)
    }
  }

  makeTrustedUrl(): void{
    // let email = 'admin@xnode.ai';
    let rawUrl = 'http://127.0.0.1:8000/?email='+ this.email +
                                        '&productContext='+ this.productContext +
                                        '&xnode_flag='+'XNODE-APP';
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);
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

  addItem(newItem : any){
    console.log(newItem)
    this.botOutput.push(newItem.toString());
    this.isSideWindowOpen = newItem.cbFlag;
    // this.isSideWindowOpen = true;
    this.productContext = newItem.productContext;
    this.makeTrustedUrl();
    console.log(this.isSideWindowOpen, this.productContext);
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
