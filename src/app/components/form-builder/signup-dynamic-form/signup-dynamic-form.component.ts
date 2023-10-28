import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UtilsService } from '../../services/utils.service';
import { BuilderService } from '../builder.service';
import { FormComponent } from '../form-component';
import { AuditutilsService } from 'src/app/api/auditutils.service';

@Component({
  selector: 'xnode-signup-dynamic-form',
  templateUrl: './signup-dynamic-form.component.html',
  styleUrls: ['./signup-dynamic-form.component.scss']
})
export class SignupDynamicFormComponent implements OnInit {

  currentUser: User | undefined;
  inputControls: FormComponent[] = []

  constructor(private apiService: ApiService, private utilsService: UtilsService, private builderService: BuilderService, private auditUtil: AuditutilsService) {
  }

  ngOnInit(): void {
    this.fetchOnboardingFlow()
  }

  fetchOnboardingFlow() {
    this.apiService.get('navi/get_xflows/' + localStorage.getItem('record_id')).then(async (response: any) => {
      if (response) {
        let user_audit_body = {
          'method': 'GET',
          'url': response?.request?.responseURL
        }
        this.auditUtil.post('RETRIEVE_XFLOWS', 1, 'SUCCESS', 'user-audit', user_audit_body);
        let onboardingFlow = response.data.Flows.filter((f: any) => f.Name.toLowerCase() === 'onboarding');
        let userProfile = onboardingFlow[0].BackendFlow.find((flow: any) => {
          return flow.TaskId == 'CreateUserProfile';
        })
        if (!userProfile) {
          userProfile = onboardingFlow.UserFlow.find((flow: any) => {
            return flow.TaskId == 'CreateUserProfile';
          })
        }
        if (userProfile) {
          this.fetchDataModel(userProfile.Entity)
        }
      }
    }).catch((error) => {
      console.log('error', error);
    });
  }

  fetchDataModel(entityName: string) {
    this.apiService.get("navi/get_insights/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('RETRIEVE_INSIGHTS', 1, 'SUCCESS', 'user-audit', user_audit_body);
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          let dataModel = Array.isArray(data.data_model) ? data.data_model[0] : data.data_model;
          this.inputControls = this.builderService.entityToDynamicForm(dataModel[entityName])
        }
        this.utilsService.loadSpinner(false);
      }).catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilsService.loadSpinner(false);
      });
  }


}
