import { Component } from '@angular/core';

@Component({
  selector: 'xnode-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'xnode';

  isUserExists() {
    return localStorage.getItem('currentUser') === 'true';
  }

  parentdata:any[] =[
      {
        Name:"Thimma chowdary",
        Age:25,
        Address:"Address1",
        Email:'thimma@gmail.comm'
      },
      {
        Name:"Thimma1",
        Age:26,
        Address:"Address12",
        Email:'thimma@gmail.comm' 
  
      },
      {
        Name:"Thimma1",
        Age:26,
        Address:"Address12",
        Email:'thimma@gmail.comm'
  
      },
    ]

}
