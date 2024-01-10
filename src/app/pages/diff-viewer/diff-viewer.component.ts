import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as DiffGen from '../../../app/utils/diff-generator';
import { NEWLIST, OLDLIST } from './mock';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecService } from 'src/app/api/spec.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { Router } from '@angular/router';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { SpecificationUtilsService } from './specificationUtils.service';
import { SpecVersion } from 'src/models/spec-versions';
declare const SwaggerUIBundle: any;

@Component({
  selector: 'xnode-diff-viewer',
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.scss'],
})
export class DiffViewerComponent implements OnInit {
  // @Input() versions: any;
  @Output() specDataChange = new EventEmitter<{
    productId: any;
    versionId: any;
  }>();
  onDiff: boolean = false;
  content: any = NEWLIST;
  content2: any = OLDLIST;
  loading: boolean = true;
  product: any;
  versions: any;
  specList: any = [];
  currentUser: any;
  keyword: any;
  selectedVersionOne: any;
  selectedVersionTwo: any;
  latestVersion: any;
  versionListOne: any = [];
  versionListTwo: any = [];
  showVersionToDiff: boolean = false;
  specOneList: any = [];
  specTwoList: any = [];

  constructor(
    private utils: UtilsService,
    private specApiService: SpecService,
    private storageService: LocalStorageService,
    private router: Router,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService
  ) {
    this.utils.startSpinner.subscribe((event: boolean) => {
      this.loading = event;
    });
    this.specificationUtils.getMeSpecList.subscribe((list: any[]) => {
      list.forEach((element: any) => {
        element.content_data_type = 'BANNER';
      });
      this.specList = list;
    });
    this.specificationUtils.getMeVersions.subscribe(
      (versions: SpecVersion[]) => {
        if (versions) {
          versions.forEach((element: any) => {
            element['label'] = element.specStatus + '-' + element.version;
            element['value'] = element.id;
          });
          this.versionListOne = versions;
          this.versionListTwo = versions;

          console.log('this.versionListOne', this.versionListOne);
        }
      }
    );
  }

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
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
    this.specApiService
      .getSpec({
        productId: this.product?.id,
        versionId: params.versionId,
      })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          response.data.forEach((element: any) => {
            element.content_data_type = 'BANNER';
          });
          if (params.type === 'one') {
            this.specList = response.data;
          } else {
            this.specTwoList = response.data;
            console.log('  this.specTwoList', this.specTwoList);
          }
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
  onVersionChange(event: any, type: string) {
    console.log('event', event);
    this.getMeSpecInfo({ versionId: event.value.id, type: type });
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

  searchText(keyword: any) {
    //   if (keyword === '') {
    //     this.clearSearchText();
    //     this.noResults = false;
    //     return;
    //   } else {
    //     this.keyword = keyword;
    //     this.specData = [];
    //     this.foundObjects = [];
    //     this.filteredSpecData = [];
    //     this.wantedIndexes = [];
    //     this.removableIndexes = [];
    //     this.specData = this.localStorageService.getItem(StorageKeys.SPEC_DATA);
    //     this.searchSpec
    //       .searchSpec(this.specData, keyword)
    //       .subscribe((returnData: any) => {
    //         if (returnData) {
    //           this.specData = returnData.specData;
    //           this.foundObjects = returnData.foundObjects;
    //           this.noResults = returnData.noResults;
    //           this.filteredSpecData = returnData.filteredSpecData;
    //           this.wantedIndexes = returnData.wantedIndexes;
    //           this.removableIndexes = returnData.removableIndexes;
    //           this.utils.passSelectedSpecItem(this.specData);
    //         }
    //       });
    //   }
  }

  diffViewChangeEmiter(event: any) {
    this.showVersionToDiff = event;
    this.selectedVersionOne = this.storageService.getItem(
      StorageKeys.SpecVersion
    );
    console.log('this.selectedVersionOne', this.selectedVersionOne);
  }
}
