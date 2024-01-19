import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NEWLIST, OLDLIST } from './mock';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecApiService } from 'src/app/api/spec-api.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { Router } from '@angular/router';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { SpecificationUtilsService } from './specificationUtils.service';
import { SpecVersion } from 'src/models/spec-versions';
import { isArray } from 'lodash';
declare const SwaggerUIBundle: any;
import { AuthApiService } from 'src/app/api/auth.service';
import { delay, of } from 'rxjs';
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
  specExpanded: boolean = false;
  product: any;
  versions: any;
  specList: any = [];
  specListForMenu: any = [];
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
  usersList: any;
  swaggerData: any;
  format: any;
  openConversationPanel: boolean = false;
  isCommentsPanelOpened: boolean = false;
  isSpecSideMenuOpened: boolean = false;
  isDockedNaviOpended: boolean = false;
  selectedSpecItem:any;
  loadSwagger: boolean= false;
  isDiffEnabled: boolean = false;

  constructor(
    private utils: UtilsService,
    private specApiService: SpecApiService,
    private storageService: LocalStorageService,
    private router: Router,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService,
    private authApiService: AuthApiService,
    private specUtils: SpecUtilsService
  ) {
    this.specificationUtils.getMeVersions.subscribe(
      (versions: SpecVersion[]) => {
        this.versions = versions;
        this.versions.forEach((element: any) => {
          element['label'] = element.specStatus + '-' + element.version;
          element['value'] = element.id;
        });
      }
    );
    this.utils.startSpinner.subscribe((event: boolean) => {
      this.loading = event;
    });
    this.specificationUtils.getMeSpecList.subscribe((list: any[]) => {
      list.forEach((element: any, index: number) => {
        element.content_data_type = 'BANNER';
        element.sNo = index + 1 + '.0';
      });
      this.specList = this.changeSpecListFormat(list);
      this.specListForMenu = list;
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
        }
      }
    );
    this.specificationUtils._openConversationPanel.subscribe((data: any) => {
      if (data) {
        this.openConversationPanel = data.openConversationPanel;
      }
    });
    this.specUtils.openCommentsPanel.subscribe((event: any) => {
      this.isCommentsPanelOpened = event;
    });
    this.utils.openSpecSubMenu.subscribe((event: any) => {
      this.isSpecSideMenuOpened = event;
    });
    this.utils.openDockedNavi.subscribe((event: any) => {
      this.isDockedNaviOpended = event;
    });
  }

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.getUsersData();
  }

  changeSpecListFormat(list: any) {
    let flattenedData = list.flatMap((item: any, itemIndex: number) => [
      item,
      ...item.content.map((innerItem: any, innerItemIndex: number) => {
        innerItem.parentId = item.id;
        innerItem.parentTitle = item.title;
        innerItem.sNo = itemIndex + 1 + '.' + (innerItemIndex + 1);
        if (innerItem.content && isArray(innerItem.content)) {
          innerItem.content.forEach((obj: any) => {
            if (
              typeof obj !== 'string' &&
              innerItem.parentId &&
              innerItem.parentTitle
            ) {
              obj['parentId'] = innerItem.parentId;
              obj['parentTitle'] = innerItem.title;
            }
          });
        }
        return innerItem;
      }),
    ]);
    return flattenedData;
  }

  getVersions() {
    this.utils.loadSpinner(true);
    this.specService.getVersions(this.product.id, (data) => {
      this.specService.getMeSpecInfo({
        productId: this.product?.id,
        versionId: data[0].id,
      });
      this.storageService.saveItem(StorageKeys.SpecVersion, data[0]);
    });
  }

  getDiffObj(fromArray: any, srcObj: any, isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    if (isArray(fromArray))
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

  onChildLoaded(isLoaded: boolean) {
    if (isLoaded) {
      of([])
        .pipe(delay(500))
        .subscribe((results) => {
          this.fetchOpenAPISpec('openapi-ui-spec');
        });
    }
  }

  getMeSpecInfo(params: any) {
    this.product = this.storageService.getItem(StorageKeys.Product);
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
          response.data.forEach((element: any, index: any) => {
            element.content_data_type = 'BANNER';
            element.sNo = index + 1 + '.0';
          });
          if (params.type === 'one') {
            this.specList = this.changeSpecListFormat(response.data);
            this.specListForMenu = response.data;
            this.specTwoList.forEach((element1: any) => {
              this.specList.forEach((element2: any) => {
                if (element2.title === element1.title)
                  element2.id = element1.id;
              });
            });
          } else {
            this.specTwoList = this.changeSpecListFormat(response.data);
            this.specList.forEach((element1: any) => {
              this.specTwoList.forEach((element2: any) => {
                if (element2.title === element1.title)
                  element2.id = element1.id;
              });
            });
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

  async fetchOpenAPISpec(id:string) {
    const record_id = localStorage.getItem('record_id');
    let userData: any;
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let swaggerUrl =
      environment.uigenApiUrl +
      'openapi-spec/' +
      localStorage.getItem('app_name') +
      '/' +
      email +
      '/' +
      record_id;
    const ui = SwaggerUIBundle({
      domNode: document.getElementById(id),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      url: swaggerUrl,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
    fetch(swaggerUrl)
      .then((response) => response.json())
      .then((data) => (this.swaggerData = data))
      .catch((error) => console.error('Error:', error));
    this.utils.loadSpinner(false);
  }

  onSpecDataChange(data: any): void {
    this.getMeSpecInfo({
      versionId: data.versionId,
      productId: data.productId,
    });
  }

  onVersionChange(event: any, type: string) {
    // type === 'one' && event.value.id === this.selectedVersionTwo.id
    //   ? (this.selectedVersionTwo = undefined)
    //   : type === 'two' && event.value.id === this.selectedVersionOne.id
    //   ? (this.selectedVersionOne = undefined)
    //   : null;
    this.utils.loadSpinner(true);
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

  getUsersData() {
    this.authApiService
      .getAllUsers(this.currentUser?.account_id)
      .then((resp: any) => {
        this.utils.loadSpinner(true);
        if (resp?.status === 200) {
          this.usersList = resp.data;
          this.storageService.saveItem(StorageKeys.USERLIST, resp.data);
          this.getVersions();
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: '',
            detail: resp.data?.detail,
          });
          this.utils.loadSpinner(false);
        }
      })
      .catch((error: any) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: '',
          detail: error,
        });
        console.error(error);
      });
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
  findIndex(objectToFind: any): number {
    return this.versions.findIndex((obj: any) => obj.id === objectToFind.id);
  }

  diffViewChangeEmiter(event: any) {
    const version: any = this.storageService.getItem(StorageKeys.SpecVersion);
    if(event.diffView){
      this.isDiffEnabled = true;
    }else{
      this.isDiffEnabled = false;
    }
    setTimeout(() => {
      if(this.isDiffEnabled){
        this.fetchOpenAPISpec('openapi-ui-spec-1');
        this.fetchOpenAPISpec('openapi-ui-spec-2');
      }else{
        this.fetchOpenAPISpec('openapi-ui-spec');
      }
    },500)
  

    this.showVersionToDiff = event.diffView;
    this.format = event.viewType;
    if (event.viewType !== null) {
      this.selectedVersionOne = this.versions.filter((obj: any) => {
        return obj.id === version.id;
      })[0];
      const index = this.findIndex(version);
      console.log('index', index, index + 1);

      this.selectedVersionTwo =
        this.versions[index === 0 ? index + 1 : index - 1];
      this.utils.loadSpinner(true);
      this.getMeSpecInfo({
        versionId: this.selectedVersionTwo.id,
        type: 'two',
      });
    } else {
      this.selectedVersionOne = undefined;
      this.selectedVersionTwo = undefined;
      this.specTwoList = [];
    }
  }

  onSelectSpecMenuItem(item: any): void {
    new Promise((resolve) => setTimeout(resolve, 500));
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  _expandComponent(val: any): void {
    if (val) {
      this.selectedSpecItem = val;
      this.utils.saveSelectedSection(val);
      this.specUtils._openCommentsPanel(false);
      this.utils.disableDockedNavi();
      this.utils.EnableSpecSubMenu();
      this.specExpanded = true;
    } else {
      this.specExpanded = false;
    }
  }

  closeFullScreenView(): void {
    this.specExpanded = false;
    this.fetchOpenAPISpec('openapi-ui-spec');
    this.scrollToItem();
  }

  async scrollToItem() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = document.getElementById(this.selectedSpecItem.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
