import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { UtilsService } from '../../services/utils.service';
import { BuilderService } from '../builder.service';
import { FormComponent } from '../form-component';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Product } from 'src/models/product';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-signup-dynamic-form',
  templateUrl: './signup-dynamic-form.component.html',
  styleUrls: ['./signup-dynamic-form.component.scss'],
})
export class SignupDynamicFormComponent implements OnInit {
  currentUser: User | undefined;
  inputControls: FormComponent[] = [];
  product: Product | undefined;
  constructor(
    private utilsService: UtilsService,
    private builderService: BuilderService,
    private auditUtil: AuditutilsService,
    private naviApiService: NaviApiService,
    private storageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.fetchOnboardingFlow();
    this.product = this.storageService.getItem(StorageKeys.Product);
  }

  fetchOnboardingFlow() {}

  fetchDataModel(entityName: string) {
    this.naviApiService
      .getInsights(this.product?.id)
      .then((response) => {
        if (response?.status === 200) {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'RETRIEVE_INSIGHTS',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body
          );
          const data = Array.isArray(response?.data)
            ? response?.data[0]
            : response?.data;
          let dataModel = Array.isArray(data.data_model)
            ? data.data_model[0]
            : data.data_model;
          this.inputControls = this.builderService.entityToDynamicForm(
            dataModel[entityName]
          );
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.utilsService.loadSpinner(false);
      });
  }
}
