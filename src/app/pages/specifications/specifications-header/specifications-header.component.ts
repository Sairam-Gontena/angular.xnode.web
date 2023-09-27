import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss']
})
export class SpecificationsHeaderComponent implements OnInit {
  currentUser: any;

  ngOnInit(): void {
    let user = localStorage.getItem('currentUser');
    if (user)
      this.currentUser = JSON.parse(user)
  }
  getMeUserAvatar() {
    var firstLetterOfFirstWord = this.currentUser.first_name[0][0].toUpperCase(); // Get the first letter of the first word
    var firstLetterOfSecondWord = this.currentUser.last_name[0][0].toUpperCase(); // Get the first letter of the second word
    return firstLetterOfFirstWord + firstLetterOfSecondWord
  }
}
