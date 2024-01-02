import { Component, OnInit } from '@angular/core';
import * as DiffGen from '../../../app/utils/diff-generator';
import { NEWLIST, OLDLIST } from './mock';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecService } from 'src/app/api/spec.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { Router } from '@angular/router';
declare const SwaggerUIBundle: any;

@Component({
  selector: 'xnode-diff-viewer',
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.scss'],
})
export class DiffViewerComponent implements OnInit {
  onDiff: boolean = false;
  content: any = NEWLIST;
  content2: any = OLDLIST;
  loading: boolean = true;
  product: any;
  versions: any;
  specList: any;
  currentUser: any;

  constructor(
    private utils: UtilsService,
    private specService: SpecService,
    private storageService: LocalStorageService,
    private router: Router
  ) {
    this.utils.startSpinner.subscribe((event: boolean) => {
      this.loading = true;
    });
  }

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser)
    this.utils.loadSpinner(true);
    this.getVersions();
    // this.fetchOpenAPISpec();
  }

  getVersions(versionId?: any) {
    this.versions = [];
    console.log('this.product', this.product);
    
    this.utils.loadSpinner(true);
    this.specService
      .getVersionIds(this.product?.id)
      .then((response) => {
        if (response.status === 200 && response.data) {
          this.versions = response.data;
          if(versionId){
            this.getMeSpecInfo({
              productId: this.product?.id,
              versionId: versionId,
            });
          }else{
            this.getMeSpecInfo({
              productId: this.product?.id,
              versionId: this.versions[0].id,
            });
          }
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


  getDiffObj(fromArray: any[], srcObj: any, isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    for (const item of fromArray) {
      if (srcObj.id === item.id) {
        return item;
      }
    }
  }

  getRemovedItems(fromArray: any[], toArray: any[], isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    const map: any = {};
    const removedItems: any[] = [];
    for (const item of toArray) {
      map[item.id] = item;
    }

    for (const item of fromArray) {
      if (!map[item.id]) {
        removedItems.push(item);
      }
    }
    return removedItems;
  }

  getMeSpecInfo(params: any) {
    this.specService
      .getSpec({
        productId: params.productId,
        versionId: params.versionId,
      })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          response.data.forEach((element: any) => {
            element.content_data_type = "BANNER";
          });
          this.specList = response.data;
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

  async fetchOpenAPISpec() {
    const record_id = localStorage.getItem('record_id');
    let userData: any;
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec'),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      url:
        environment.uigenApiUrl +
        'openapi-spec/' +
        localStorage.getItem('app_name') +
        '/' +
        email +
        '/' +
        record_id,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
    this.utils.loadSpinner(false);
  }

  onSpecDataChange(data: any): void {
    this.getMeSpecInfo({
      versionId: data.versionId,
      productId: data.productId,
    });
  }

  checkUserEmail(): void {
    // if (this.currentUser.email === this.product.email) {
    //   // this.showSpecGenaretePopup = true;
    //   this.isTheCurrentUserOwner = true;
    //   this.productStatusPopupContent =
    //     ' Do you want to regenerate Spec for this product?';
    // } else {
    //   // this.showSpecGenaretePopup = true;
    //   this.isTheCurrentUserOwner = false;
    //   this.productStatusPopupContent =
    //     'No spec generated for this product. You don`t have access to create the spec. Product owner can create the spec.';
    // }
  }

  
  refreshCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
