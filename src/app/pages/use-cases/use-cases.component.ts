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

  constructor(
    private utils: UtilsService,
    private storageService: LocalStorageService
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
    localStorage.setItem('product', JSON.stringify(obj));
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
    const list: any = this.storageService.getItem(StorageKeys.SpecData);
    this.useCases = list[2].content[0].content;
  }
}
