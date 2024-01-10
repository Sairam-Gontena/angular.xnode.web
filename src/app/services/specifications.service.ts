import { Injectable } from '@angular/core';
import { UtilsService } from '../components/services/utils.service';
import { SpecService } from '../api/spec.service';
import { LocalStorageService } from '../components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecificationUtilsService } from '../pages/diff-viewer/specificationUtils.service';
import { Product } from 'src/models/product';

@Injectable({
  providedIn: 'root',
})
export class SpecificationsService {
  constructor(
    private utils: UtilsService,
    private specApiService: SpecService,
    private storageService: LocalStorageService,
    private specUtils: SpecificationUtilsService
  ) {}

  getVersions(
    productId: string,
    successCallback?: (data: any) => void,
    errorCallback?: (error: any) => void
  ) {
    this.specApiService
      .getVersionIds(productId)
      .then((response) => {
        if (response.status === 200 && response.data) {
          this.specUtils.saveVerions(response.data);
          if (successCallback) successCallback(response.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: 'Network Error',
          });
        }
      })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      });
  }

  getMeSpecInfo(params: any) {
    this.specApiService
      .getSpec({
        productId: params.productId,
        versionId: params.versionId,
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          response.data.forEach((element: any) => {
            element.content_data_type = 'BANNER';
          });
          console.log(' response.data', response.data);

          this.specUtils.saveSpecList(response.data);
        }
        this.utils.loadSpinner(false);
      })
      .catch((error) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      });
  }
}
