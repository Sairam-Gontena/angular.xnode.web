import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { UserUtil, User } from '../../utils/user-util';
import { Product } from 'src/models/product';
import { ApiService } from 'src/app/api/api.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss'],
  providers: [MessageService]
})
export class UseCasesComponent implements OnInit {
  product?: Product;
  currentUser?: User;
  useCases: any;

  constructor(private utils: UtilsService,
    private apiService: ApiService,
    private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.utils.loadSpinner(true);
    this.getMeStorageData();
  }

  onChangeProduct(obj: any): void {
    localStorage.setItem('record_id', obj?.id);
    localStorage.setItem('app_name', obj.title);
    localStorage.setItem('product_url', obj.url && obj.url !== '' ? obj.url : '');
    localStorage.setItem('product', JSON.stringify(obj));
    this.utils.loadSpinner(true);
    this.getMeStorageData();
  }

  getMeStorageData(): void {
    let product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
      if (!this.product?.has_insights) {
        this.utils.showProductStatusPopup(true);
        return
      }
    }
    // this.getUsecases();
  }

  getUsecases() {
    this.apiService.get("navi/get_insights/" + this.product?.email + "/" + this.product?.id)
      .then(response => {
        if (response?.status === 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.postAudit('GET_USE_CASES_RETRIEVE_INSIGHTS', 1, 'SUCCESS', 'user-audit', user_audit_body, this.currentUser?.email, this.product?.id);
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data?.usecase || [];
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.postAudit('GET_USE_CASES_RETRIEVE_INSIGHTS', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser?.email, this.product?.id);
          this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
          this.utils.showProductStatusPopup(true);
        }
        this.utils.loadSpinner(false);
      })
      .catch(error => {
        let user_audit_body = {
          'method': 'GET',
          'url': error?.request?.responseURL
        }
        this.auditUtil.postAudit('GET_USE_CASES_RETRIEVE_INSIGHTS', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser?.email, this.product?.id);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utils.loadSpinner(false);
      });
  }

}
