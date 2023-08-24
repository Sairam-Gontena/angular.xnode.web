import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'xnode-signup-dynamic-form',
  templateUrl: './signup-dynamic-form.component.html',
  styleUrls: ['./signup-dynamic-form.component.scss']
})
export class SignupDynamicFormComponent implements OnInit {
  currentUser: User | undefined;

  constructor(private apiService: ApiService, private utilsService: UtilsService){
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.fetchOnboardingFlow(this.currentUser?.email)
  }

  fetchOnboardingFlow(email:string|undefined) {
    this.apiService.get('/retrieve_xflows/' + email +'/' +localStorage.getItem('record_id')).then(async (response: any) => {
        if (response) {
          let onboardingFlow = response.data.Flows.filter((f: any) => f.Name.toLowerCase() === 'onboarding');
          let userProfile = onboardingFlow[0].BackendFlow.find((flow:any) =>{
           return flow.TaskId == 'CreateUserProfile';
          })
          if(!userProfile) {
            userProfile = onboardingFlow.UserFlow.find((flow:any) =>{
              return flow.TaskId == 'CreateUserProfile';
             })
          }
          if(userProfile) {
            this.fetchDataModel(email, userProfile.Entity)
          }
        }
      }).catch((error) => {
      });
  }

  fetchDataModel(email:string|undefined, entity:string) {
    this.apiService.get("/retrive_insights/" + email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          let dataModel = Array.isArray(data.data_model) ? data.data_model[0] : data.data_model;
        }
        this.utilsService.loadSpinner(false);
      })
      .catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilsService.loadSpinner(false);
      });
  }
}
