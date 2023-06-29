import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'xnode';
  botOutput = ['false'];
  isSideWindowOpen: boolean = false;

  constructor(private router : Router) {

  }

  ngOnInit(): void {

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
