import { Component } from '@angular/core';

@Component({
  selector: 'xnode-cr-tabs',
  templateUrl: './cr-tabs.component.html',
  styleUrls: ['./cr-tabs.component.scss']
})
export class CrTabsComponent {
  filters:any;
  currentUser: any;
  constructor(){

  }

  ngOnInit(){
    this.filters =  [
          { title: 'Filters', code: 'F' },
          { title: 'All', code: 'A' },
          { title: 'None', code: 'N' },
      ];
  const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
  }

  getMeUserAvatar(report?: any) {
    let words: any;
    if (report) {
      words = report?.userName?.split(" ");
    } else {
      words = [this.currentUser?.first_name, this.currentUser?.last_name];
    }
    if (words?.length >= 2) {
      var firstLetterOfFirstWord = words[0][0].toUpperCase(); // Get the first letter of the first word
      var firstLetterOfSecondWord = words[1][0].toUpperCase(); // Get the first letter of the second word
      return firstLetterOfFirstWord + firstLetterOfSecondWord
    }
  }

}
