import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NEWLIST, OLDLIST } from './mock';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecApiService } from 'src/app/api/spec-api.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { ActivatedRoute, Router } from '@angular/router';
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
  onDiffValue: boolean = false;
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
  fetchApiSpecCall:boolean=true;
  diffObj:any;
  loadSwagger: boolean= false;
  isDiffEnabled: boolean = false;
  specRouteParams: any;
  selectedVersion?: SpecVersion;

  constructor(
    private utils: UtilsService,
    private specApiService: SpecApiService,
    private storageService: LocalStorageService,
    private router: Router,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService,
    private authApiService: AuthApiService,
    private specUtils: SpecUtilsService,
    private route: ActivatedRoute
  ) {

    this.specificationUtils.getMeSpecList.subscribe((list: any[]) => {
      if (list && list.length) {
        list.forEach((element: any, index: number) => {
          element.content_data_type = 'BANNER';
          element.sNo = index + 1 + '.0';
        });
        this.specList = this.changeSpecListFormat(list);
        this.specListForMenu = list;
      }
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
    this.selectedVersionOne = this.storageService.getItem(StorageKeys.SpecVersion)
    this.route.queryParams.subscribe((params: any) => {
      this.specRouteParams = params;
      if (params?.template_type === 'COMMENT') {
        this.specificationUtils.openConversationPanel({
          openConversationPanel: true,
          parentTabIndex: 0,
          childTabIndex: 0,
        });
        this.specService.getMeAllComments({
          productId: params?.productId ? params?.productId : params?.product_id,
          versionId: params?.versionId ? params.versionId : params.version_id,
        });
      } else if (params?.template_type === 'TASK') {
        this.specificationUtils.openConversationPanel({
          openConversationPanel: true,
          parentTabIndex: 0,
          childTabIndex: 1,
        });
        this.specService.getMeAllTasks({
          productId: params?.productId ? params?.productId : params?.product_id,
          versionId: params?.versionId ? params.versionId : params.version_id,
        });
      } else if (params?.template_type === 'WORKFLOW') {
        this.specificationUtils.openConversationPanel({
          openConversationPanel: true,
          parentTabIndex: 1,
        });
        this.specService.getMeCrList({
          productId: params?.productId ? params?.productId : params?.product_id,
        });
      }
      this.getUsersData();
    })
  }

  changeSpecListFormat(list: any) {
    let flattenedData = list.flatMap((item: any, itemIndex: number) => [
      item,
      ...item.content.map((innerItem: any, innerItemIndex: number) => {
        innerItem.parentId = item.id;
        innerItem.specTitle = item.title;
        innerItem.parentTitle = item.title;
        innerItem.sNo = itemIndex + 1 + '.' + (innerItemIndex + 1);
        if (innerItem.content && isArray(innerItem.content)) {
          innerItem.content.forEach((obj: any) => {
            if (
              typeof obj !== 'string' &&
              innerItem.parentId &&
              innerItem.parentTitle
            ) {
              obj['parentId'] = item.id;
              obj['parentTitle'] = item.title;
              obj['specTitle'] = innerItem.title;
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
      let version = data.filter((obj: any) => { return obj.id === this.specRouteParams.versionId ? this.specRouteParams.versionId : this.specRouteParams.version_id })[0];
      this.specService.getMeSpecInfo({
        productId: this.product?.id,
        versionId: version ? version.id : data[0].id,
      });
      this.versions = data;
      this.selectedVersion = version ? version : data[0];
      this.storageService.saveItem(StorageKeys.SpecVersion, version ? version : data[0]);
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
          this.fetchOpenAPISpec('openapi-ui-spec',this.selectedVersionOne.id);
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

  async fetchOpenAPISpec(id:string,versionId:string) {
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
        record_id  +
        '/'+versionId;
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

  versionChange(e:any){
    if(e.diffView){
      this.fetchOpenAPISpec('openapi-ui-spec-1',this.selectedVersionOne.id);
      this.fetchOpenAPISpec('openapi-ui-spec-2',this.selectedVersionTwo.id);
    }else{
      this.fetchOpenAPISpec('openapi-ui-spec',this.selectedVersionOne.id);
    }
  }

  diffViewChangeEmiter(event: any) {
    const version: any = this.storageService.getItem(StorageKeys.SpecVersion);
    if (event.diffView) {
      this.isDiffEnabled = true;
    } else {
      this.isDiffEnabled = false;
    }
    setTimeout(() => {
      if(this.isDiffEnabled){
        this.fetchOpenAPISpec('openapi-ui-spec-1',this.selectedVersionOne.id);
        this.fetchOpenAPISpec('openapi-ui-spec-2',this.selectedVersionTwo.id);
      }else{
        let specVersionOne:any = this.storageService.getItem(StorageKeys.SpecVersion);
        this.fetchOpenAPISpec('openapi-ui-spec',specVersionOne.id);
      }
    }, 1000);



    this.showVersionToDiff = event.diffView;
    this.format = event.viewType;
    if (event.viewType !== null) {
      this.selectedVersionOne = this.versions.filter((obj: any) => {
        return obj.id === version.id;
      })[0];
      const index = this.findIndex(version);
      this.selectedVersionTwo = this.versions[index === 0 ? index + 1 : index - 1];
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

  _expandComponent(object: any): void {
    object.onDiff ? this.diffObj = object.diffObj : this.diffObj = undefined;
    if (object.contentObj) {
      this.selectedSpecItem = object.contentObj;
      this.specificationUtils.openConversationPanel({openConversationPanel: false})
      this.utils.disableDockedNavi();
      this.utils.EnableSpecSubMenu();
      this.specExpanded = true;
    } else {
      this.specExpanded = false;
    }
  }

  closeFullScreenView(): void {
    this.specExpanded = false;
    this.scrollToItem();
    let obj = { diffView : this.isDiffEnabled };
    this.diffViewChangeEmiter(obj)
    // this.fetchOpenAPISpec('openapi-ui-spec',this.selectedVersionOne.id);
  }

  async scrollToItem() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = document.getElementById(this.selectedSpecItem.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
