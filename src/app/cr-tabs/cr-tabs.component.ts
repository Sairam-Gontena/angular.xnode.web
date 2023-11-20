import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UtilsService } from '../components/services/utils.service';
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
  constructor(private api:ApiService,
    private utilsService: UtilsService){
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

  getCRList(){
    const prodId = localStorage.getItem('record_id');
    this.utilsService.loadSpinner(true);
    this.api.getComments('change-request?productId='+prodId).then((res:any)=>{
      if(res){
        this.crData = res.data;
      }else{
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch((err:any)=>{
      console.log(err)
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      this.utilsService.loadSpinner(false);
    });
  }

  getCRDetails(crId:any){
    this.utilsService.loadSpinner(true);
    this.api.getComments('cr-entity-mapping?crId='+crId).then((res:any)=>{
      if(res){
        this.subCRData = res.data;
      }else{
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data?.common?.status });
      }
      this.utilsService.loadSpinner(false);
    }).catch((err:any)=>{
      console.log(err);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      this.utilsService.loadSpinner(false);
    })
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
