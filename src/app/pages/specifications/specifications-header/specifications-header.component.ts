import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';


@Component({
  selector: 'xnode-specifications-header',
  templateUrl: './specifications-header.component.html',
  styleUrls: ['./specifications-header.component.scss']
})
export class SpecificationsHeaderComponent implements OnInit {
  currentUser: any;
  isSideMenuOpened: any

  constructor(
    private utils: UtilsService
  ) {

  }

  ngOnInit(): void {
    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isSideMenuOpened = data;
    })
    let user = localStorage.getItem('currentUser');
    if (user)
      this.currentUser = JSON.parse(user)
  }
  getMeUserAvatar() {
    var firstLetterOfFirstWord = this.currentUser.first_name[0][0].toUpperCase(); // Get the first letter of the first word
    var firstLetterOfSecondWord = this.currentUser.last_name[0][0].toUpperCase(); // Get the first letter of the second word
    return firstLetterOfFirstWord + firstLetterOfSecondWord
  }

  toggleSideMenu() {
    this.utils.EnableSpecSubMenu()
  }
}
