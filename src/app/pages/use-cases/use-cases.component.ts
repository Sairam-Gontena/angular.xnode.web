import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import { User } from '../../utils/user-util';
import { Product } from 'src/models/product';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecApiService } from 'src/app/api/spec-api.service';

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

  constructor(
    private utils: UtilsService,
    private storageService: LocalStorageService,
    private auditUtil: AuditutilsService,
    private specApiService: SpecApiService
  ) { }

  ngOnInit(): void {
    this.getMeStorageData();
  }

  onChangeProduct(obj: any): void {
    this.storageService.saveItem(StorageKeys.Product, obj);
    this.getMeStorageData();
  }

  getMeStorageData(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.getMeUsecases();
  }

  getMeUsecases(): void {
    this.specApiService
      .getUsecases(this.product?.id)
      .then((response: any) => {
        if (response?.status === 200) {
          this.useCases = response.data;
          this.auditUtil.postAudit(
            'RETRIEVE_USECASES',
            1,
            'SUCCESS',
            'user-audit'
          );
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.detail,
          });
          this.auditUtil.postAudit(
            'RETRIEVE_USECASES' + response?.data?.detail,
            1,
            'FAILURE',
            'user-audit'
          );
        }
        this.utils.loadSpinner(false);
      })
      .catch((error) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.utils.loadSpinner(false);
        this.auditUtil.postAudit(
          'RETRIEVE_USECASES' + error,
          1,
          'FAILURE',
          'user-audit'
        );
      });
  }
}
