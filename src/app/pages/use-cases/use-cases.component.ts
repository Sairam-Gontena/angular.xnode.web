import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss'],
  providers: [MessageService]
})
export class UseCasesComponent implements OnInit {
  useCases: any = [];
  id: String = '';
  currentUser?: User;
  loading: boolean = true;
  highlightedIndex: any;
  product: any;
  product_id: any;

  constructor(private apiService: ApiService, private utils: UtilsService, private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.utils.startSpinner.subscribe((event: boolean) => {
      setTimeout(() => {
        this.loading = event;
      }, 0);
    });
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
      this.product_id = JSON.parse(product).id;
    }
    if (this.product && !this.product?.has_insights) {
      this.utils.showProductStatusPopup(true);
      return
    }
    this.getUsecases();
    this.utils.loadSpinner(true);
  }

  getUsecases() {
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + this.product_id)
      .then(response => {
        if (response?.status === 200) {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('RETRIEVE_INSIGHTS', 1, 'SUCCESS', 'user-audit', user_audit_body);
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data?.usecase || [];
        } else {
          let user_audit_body = {
            'method': 'GET',
            'url': response?.request?.responseURL
          }
          this.auditUtil.post('RETRIEVE_INSIGHTS', 1, 'FAILED', 'user-audit', user_audit_body);
          this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
          this.utils.showProductStatusPopup(true);
        }
        this.utils.loadSpinner(false);
      })
      .catch(error => {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utils.loadSpinner(false);
      });
  }


}
