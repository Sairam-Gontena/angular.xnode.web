import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
@Component({
  selector: 'xnode-cr-tabs',
  templateUrl: './cr-tabs.component.html',
  styleUrls: ['./cr-tabs.component.scss']
})
export class CrTabsComponent {
  filters:any;
  currentUser: any;
  crData:any;
  subCRData:any;
  constructor(private api:ApiService){

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
    this.getCRList();
  }

  getCRList(){
    const prodId = localStorage.getItem('record_id');
    this.api.getComments('change-request?productId='+prodId).then((res:any)=>{
      this.crData = res.data;
    }).catch((err:any)=>{
      console.log(err)
    });
  }

  getCRDetails(crId:any){
    this.api.getComments('cr-entity-mapping?crId='+crId).then((res:any)=>{
      this.subCRData = res.data
    }).catch((err:any)=>{
      console.log(err)
    })
  }

  truncateText(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + ' ...' : text;
  }

  getMeUserAvatar(report?: any) {
    let words: any;
    if (report) {
      words = report?.firstName + report?.lastName
    } else {
      words = report?.firstName + report?.lastName
    }
    if (words?.length >= 2) {
      var firstLetterOfFirstWord = words[0][0].toUpperCase(); // Get the first letter of the first word
      var firstLetterOfSecondWord = words[1][0].toUpperCase(); // Get the first letter of the second word
      return firstLetterOfFirstWord + firstLetterOfSecondWord
    }
  }

}
