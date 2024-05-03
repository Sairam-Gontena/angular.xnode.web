import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NEWLIST, OLDLIST } from './mock';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecApiService } from 'src/app/api/spec-api.service';
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
import { SearchspecService } from 'src/app/api/searchspec.service';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';
import { MessagingService } from '../../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';

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
  conversationPanelInfo: any;
  selectedSpecItem: any;
  fetchApiSpecCall: boolean = true;
  diffObj: any;
  loadSwagger: boolean = false;
  isDiffEnabled: boolean = false;
  specRouteParams: any;
  selectedVersion?: SpecVersion;
  isSideMenuOpened: boolean = false;
  isDockedNaviEnabled: boolean = true;

  filteredSpecData: any;
  foundObjects: any[] = [];
  wantedIndexes: any[] = [];
  removableIndexes: any[] = [];
  noResults: boolean = false;
  specData: any;
  specListCopy: any;
  metaDeta: any;

  constructor(private utils: UtilsService,
    private specApiService: SpecApiService,
    private storageService: LocalStorageService,
    private router: Router,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService,
    private authApiService: AuthApiService,
    private route: ActivatedRoute,
    private searchSpec: SearchspecService,
    private conversationService: ConversationHubService,
    private messagingService: MessagingService) {
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      if (msg.msgType === MessageTypes.CLOSE_NAVI && msg.msgData == false) {
        this.isSideMenuOpened = false;
      }
    })
    this.specificationUtils._openConversationPanel.subscribe((data: any) => {
      if (data) {
        this.conversationPanelInfo = data;
      }
    });

    this.specificationUtils.getMeSpecList.subscribe((list: any[]) => {
      if (list && list.length) {
        list.forEach((element: any, index: number) => {
          element.content_data_type = 'BANNER';
          element.sNo = index + 1 + '.0';
        });
        this.specList = this.changeSpecListFormat(list);
        this.specListCopy = this.specList;
        this.specListForMenu = list;
      }
    });
    this.utils.getMeSpecItem.subscribe((event: any) => {
      if (event) {
        this.specList = this.changeSpecListFormat(event);
      }
    });
    this.specificationUtils.getMeVersions.subscribe(
      (versions: SpecVersion[]) => {
        if (versions && versions.length > 0) {
          versions.forEach((element: any) => {
            element['label'] = element.specStatus + '-' + element.version;
            element['value'] = element.id;
          });
          this.versions = versions;
          this.selectedVersion = this.storageService.getItem(
            StorageKeys.SpecVersion
          );
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

    this.utils.openDockedNavi.subscribe((event: any) => {
      this.isDockedNaviEnabled = event;
      if (event) {
        this.isSideMenuOpened = false;
        this.openConversationPanel = false;
      }
    });
  }

  ngOnInit(): void {
    let getDeepLinkInfoObj: any = this.storageService.getItem(StorageKeys.DEEP_LINK_INFO);
    if (getDeepLinkInfoObj && getDeepLinkInfoObj.product_id) {
      this.utils.saveProductId(getDeepLinkInfoObj.product_id);
      this.authApiService.setDeeplinkURL("");
      this.storageService.removeItem(StorageKeys.DEEP_LINK_INFO);
    }
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.metaDeta = this.storageService.getItem(StorageKeys.MetaData);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.selectedVersionOne = this.storageService.getItem(
      StorageKeys.SpecVersion
    );
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
      } else if (params?.template_type === 'WORKFLOW' || params?.template_type === 'UPDATE_SPEC') {
        this.specificationUtils.openConversationPanel({
          openConversationPanel: true,
          parentTabIndex: 1
        });
        this.specService.getMeCrList({
          productId: params?.productId ? params?.productId : params?.product_id,
        });
      }
      this.getUsersData();
    });
    this.utils.getMeProductId.subscribe((data) => {
      if (data || this.isDockedNaviEnabled) {
        this.getVersions({ id: data })
      }
    })
  }

  isMeneOpened(event: any) {
    this.isSideMenuOpened = event;
    this.messagingService.sendMessage({
      msgType: MessageTypes.CLOSE_NAVI,
      msgData: true,
    });
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
            if (typeof obj !== 'string' && innerItem.parentId && innerItem.parentTitle) {
              obj['parentId'] = item.id;
              obj['parentTitle'] = item.title;
              obj['specTitle'] = innerItem.title;
            }
            if (obj.content && isArray(obj.content)) {
              obj.content.forEach((objItem: any) => {
                if (typeof objItem !== 'string' && obj.parentId && obj.parentTitle) {
                  objItem['parentId'] = item.id;
                  objItem['parentTitle'] = item.title;
                  objItem['specTitle'] = obj.title;
                }
              });
            }
          });
        }
        return innerItem;
      }),
    ]);
    return flattenedData;
  }

  getVersions(emitObj?: any) {
    this.utils.loadSpinner(true);
    if (emitObj) {
      let product = this.metaDeta.find((x: any) => x.id === emitObj.id);
      if (product) {
        localStorage.setItem('record_id', product.id);
        localStorage.setItem('product', JSON.stringify(product))
        localStorage.setItem('app_name', product.title);
        localStorage.setItem('product_url', emitObj.url && emitObj.url !== '' ? emitObj.url : '');
        this.product = product;
        this.conversationService.getConversations('?productId=' + product.id).then((data: any) => {
          if (data.data) {
            this.storageService.saveItem(StorageKeys.CONVERSATION, data.data[0]);
            this.utils.saveProductDetails(product);
          } else {
            this.utils.saveProductDetails(product);
          }
        }).catch((err: any) => {
          console.log(err, 'err')
          this.utils.saveProductDetails(product);
        })
      }
    }
    if (typeof this.product === 'string') {
      this.product = JSON.parse(this.product)
    }
    if (this.product && this.product.id) {
      this.specService.getVersions(this.product.id, (data) => {
        if (data?.length) {
          let version = data.filter((obj: any) => {
            return obj.id === this.specRouteParams.versionId ? this.specRouteParams.versionId : this.specRouteParams.version_id;
          })[0];

          const uniqueStatuses = [
            ...new Set(data.map((obj: any) => obj.specStatus)),
          ];
          const priorityOrder = uniqueStatuses.sort((a, b) => {
            if (a === 'LIVE') return -1;
            if (b === 'LIVE') return 1;
            return 0;
          });
          const firstObjectWithPriority = data.find(
            (obj: any) => obj.specStatus === priorityOrder[0]
          );
          this.specService.getMeSpecInfo({
            productId: this.product?.id,
            versionId: version ? version.id : firstObjectWithPriority.id,
          },
            (specData) => {
              if (specData) {
                if (
                  this.conversationPanelInfo?.openConversationPanel &&
                  this.conversationPanelInfo?.parentTabIndex === 0 &&
                  this.conversationPanelInfo?.childTabIndex === 0
                ) {
                  this.specService.getMeAllComments({
                    productId: this.product?.id,
                    versionId: firstObjectWithPriority.id,
                  });
                } else if (
                  this.conversationPanelInfo?.openConversationPanel &&
                  this.conversationPanelInfo?.parentTabIndex === 0 &&
                  this.conversationPanelInfo?.childTabIndex === 1
                ) {
                  this.specService.getMeAllTasks({
                    productId: this.product?.id,
                    versionId: firstObjectWithPriority.id,
                  });
                } else if (this.conversationPanelInfo?.openConversationPanel && this.conversationPanelInfo?.parentTabIndex === 1) {
                  this.specService.getMeCrList({ productId: this.product?.id });
                }
              }
            });
          this.versions = data;
          this.selectedVersion = version ? version : firstObjectWithPriority;
          this.storageService.saveItem(
            StorageKeys.SpecVersion,
            version ? version : firstObjectWithPriority
          );
        } else {
          this.utils.loadSpinner(false);
        }
      });
    }
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
        .subscribe((results: any) => {
          this.fetchSwaggerFunction();
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

  async fetchOpenAPISpec(id: string, versionId: string) {
    const product: any = this.storageService.getItem(StorageKeys.Product)
    let swaggerUrl =
    environment.apiUrl + environment.endpoints.spec +
      'product-spec/openapi-spec/' +
      product.title +
      '/' +
      product?.id +
      '/' +
      versionId;
    const headers = {
      'Authorization': `Bearer ${this.storageService.getItem(StorageKeys.ACCESS_TOKEN)}`,
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'dfa5a9e0fbfa43809ea3e6212647dd53',
    };
    try {
      const response = await fetch(swaggerUrl, { headers });
      const spec = await response.json();

      // Do something with the spec, e.g., render it with SwaggerUIBundle
      const ui = SwaggerUIBundle({
        domNode: document.getElementById(id),
        layout: 'BaseLayout',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
        spec,
        docExpansion: 'none',
        operationsSorter: 'alpha',
      });

      this.utils.loadSpinner(false);
    } catch (error) {
      this.utils.loadSpinner(false);
      console.error('Error fetching OpenAPI spec:', error);
      // Handle error
    }
  }

  onSpecDataChange(data: any): void {
    this.getMeSpecInfo({
      versionId: data.versionId,
      productId: data.productId,
    });
  }

  onVersionChange(event: any, type: string) {
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
    if (keyword === '') {
      this.clearSearchText();
      this.noResults = false;
      return;
    } else {
      this.keyword = keyword;
      this.specData = [];
      this.foundObjects = [];
      this.filteredSpecData = [];
      this.wantedIndexes = [];
      this.removableIndexes = [];
      this.specData = this.storageService.getItem(StorageKeys.SPEC_DATA);
      this.searchSpec
        .searchSpec(this.specData, keyword)
        .subscribe((returnData: any) => {
          if (returnData) {
            this.specData = returnData.specData;
            this.foundObjects = returnData.foundObjects;
            this.noResults = returnData.noResults;
            this.filteredSpecData = returnData.filteredSpecData;
            this.wantedIndexes = returnData.wantedIndexes;
            this.removableIndexes = returnData.removableIndexes;
            this.utils.passSelectedSpecItem(this.specData);
          }
        });
    }
  }

  clearSearchText() {
    this.keyword = '';
    this.specList = this.specListCopy;
  }

  findIndex(objectToFind: any): number {
    return this.versions.findIndex((obj: any) => obj.id === objectToFind.id);
  }

  diffViewChangeEmiter(event: any) {
    const version: any = this.storageService.getItem(StorageKeys.SpecVersion);
    if (event.diffView) {
      this.isDiffEnabled = true;
    } else {
      this.isDiffEnabled = false;
    }
    this.showVersionToDiff = event.diffView;
    this.format = event.viewType;
    if (event.viewType !== null) {
      this.selectedVersionOne = this.versions.filter((obj: any) => {
        return obj.id === version.id;
      })[0];
      const index = this.findIndex(version);
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

  fetchSwaggerFunction() {
    if (this.isDiffEnabled) {
      this.fetchOpenAPISpec('openapi-ui-spec-1', this.selectedVersionOne.id);
      this.fetchOpenAPISpec('openapi-ui-spec-2', this.selectedVersionTwo.id);
    } else {
      if (this.selectedVersion)
        this.fetchOpenAPISpec('openapi-ui-spec', this.selectedVersion.id);
    }
  }

  onSelectSpecMenuItem(item: any): void {
    new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
      const element = document.getElementById(item.id);
      const contentContainer = document.getElementById('content-container');
      if (element && contentContainer) {
        const offsetTop = element.offsetTop - contentContainer.offsetTop;
        contentContainer.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  }

  _expandComponent(object: any): void {
    object.onDiff
      ? (this.diffObj = object.diffObj)
      : (this.diffObj = undefined);
    if (object.contentObj) {
      this.selectedSpecItem = object.contentObj;
      this.specificationUtils.openConversationPanel({
        openConversationPanel: false,
      });
      this.utils.disableDockedNavi();
      this.utils.EnableSpecSubMenu(); // this.utils.openOrClosePanel(SidePanel.None);
      this.specExpanded = true;
    } else {
      this.specExpanded = false;
    }
  }

  closeFullScreenView() {
    setTimeout(() => {
      this.specExpanded = false;
      this.fetchSwaggerFunction();
      this.scrollToItem();
    }, 100);
  }

  async scrollToItem() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = document.getElementById(this.selectedSpecItem.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
