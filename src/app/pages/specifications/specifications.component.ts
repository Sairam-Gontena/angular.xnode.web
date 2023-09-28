import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss']
})
export class SpecificationsComponent implements OnInit {
  currentUser: any;
  specData?: any;;
  selectedSpec: any;
  selectedSection: any;


  constructor(
    private utils: UtilsService,
    private apiService: ApiService
  ) {

  }

  ngOnInit(): void {
    this.getMeSpecList();
    let user = localStorage.getItem('currentUser');
    if (user)
      this.currentUser = JSON.parse(user)
  }
  getMeUserAvatar() {
    var firstLetterOfFirstWord = this.currentUser.first_name[0][0].toUpperCase(); // Get the first letter of the first word
    var firstLetterOfSecondWord = this.currentUser.last_name[1][0].toUpperCase(); // Get the first letter of the second word
    return firstLetterOfFirstWord + firstLetterOfSecondWord
  }

  getMeSpecList(): void {
    this.utils.loadSpinner(true);
    this.apiService.getApi("specs/retrieve/" + '0a398791-1dc2-4fd6-b78b-b73928844e37')
      .then(response => {
        if (response?.status === 200 && !response.data.detail) {
          const list = response.data;
          list.forEach((obj: any, index: any) => {
            if (obj?.title && obj?.section) {
              obj.section.unshift({ title: obj.title, created_by: obj.created_by, created_on: obj.created_on, modified_by: obj.modified_by, modified_on: obj.modified_on })
              obj.section.forEach((element: any) => {
                element.parentIndex = index
              });
            }
          })
          this.specData = list;
          this.specData.pop();
          this.utils.passSelectedSpecItem(list);
        } else {
          this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data.detail });
        }
        this.utils.loadSpinner(false);

      }).catch(error => {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
      });
  }
}
