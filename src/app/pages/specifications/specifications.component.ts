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
  specId: any
  productStatusPopupContent: any;
  showSpecGenaretePopup: any;

  constructor(
    private utils: UtilsService,
    private apiService: ApiService
  ) {

  }

  ngOnInit(): void {
    let user = localStorage.getItem('currentUser');
    this.getMeSpecList();
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
    this.apiService.getApi("specs/retrieve/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200 && !response.data.detail) {
          const list = response.data;
          list.forEach((obj: any, index: any) => {
            if (obj?.title && obj?.section) {
              if(obj?.title == 'Technical Specifications') {
                obj.section.push({ title: 'OpenAPI Spec', content:[],parentIndex:4.10,contentType:'OpenAPI', created_by: obj.created_by, created_on: obj.created_on, modified_by: obj.modified_by, modified_on: obj.modified_on })
              }
              obj.section.unshift({ title: obj.title, created_by: obj.created_by, created_on: obj.created_on, modified_by: obj.modified_by, modified_on: obj.modified_on })
              obj.section.forEach((element: any, sIndex: any) => {
                element.parentIndex = (index + 1).toString() + "." + (sIndex).toString()
              });
            }
          })
          this.specData = list;
          this.specData.pop();
          this.utils.passSelectedSpecItem(list);
        } else {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

          this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data.detail });
          this.productStatusPopupContent = 'No spec generated for this product. Do you want to generate Spec?';
          this.showSpecGenaretePopup = true;
        }
        this.utils.loadSpinner(false);

      }).catch(error => {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
      });
  }
}
