import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { UserUtil, User } from '../../utils/user-util';
import { Product } from 'src/models/product';
import { ApiService } from 'src/app/api/api.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss'],
  providers: [MessageService],
})
export class UseCasesComponent implements OnInit {
  product?: Product;
  currentUser?: User;
  useCases: any;
  specData: any;
  productChanged: boolean = false;

  constructor(
    private utils: UtilsService,
    private storageService: LocalStorageService,
    private apiService: ApiService,
    private auditUtil: AuditutilsService
  ) { }

  ngOnInit(): void {
    this.getMeStorageData();
  }

  onChangeProduct(obj: any): void {
    localStorage.setItem('record_id', obj?.id);
    localStorage.setItem('app_name', obj.title);
    localStorage.setItem(
      'product_url',
      obj.url && obj.url !== '' ? obj.url : ''
    );
    localStorage.setItem('has_insights', obj.has_insights);
    localStorage.setItem('product', JSON.stringify(obj));
    this.productChanged = true;
    this.getMeStorageData();
  }

  getMeStorageData(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    if (!this.product?.has_insights) {
      this.utils.showProductStatusPopup(true);
      return;
    }

    this.getMeUsecases();
  }

  getMeUsecases(): void {
    if (this.productChanged) {
      this.apiService.get("navi/get_usecases/" + localStorage.getItem('record_id'))
        .then((response: any) => {
          if (response?.status === 200) {
            this.useCases = response.data;
            this.auditUtil.postAudit("RETRIEVE_USECASES", 1, 'SUCCESS', 'user-audit');
          } else {
            this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
            this.auditUtil.postAudit("RETRIEVE_USECASES" + response?.data?.detail, 1, 'FAILURE', 'user-audit');
          }
          this.utils.loadSpinner(false);
        }).catch(error => {
          let user_audit_body = {
            'method': 'GET',
            'url': error?.request?.responseURL
          }
          this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
          this.utils.loadSpinner(false);
          this.auditUtil.postAudit("RETRIEVE_USECASES" + error, 1, 'FAILURE', 'user-audit');
          this.productChanged = false;
        });
    } else {
      const list: any = this.storageService.getItem(StorageKeys.SpecData);
      this.useCases = list[2].content[0].content;
    }
  }
}
