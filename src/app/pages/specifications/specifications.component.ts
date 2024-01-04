import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as _ from 'lodash';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { SpecContent } from 'src/models/spec-content';
import { SearchspecService } from 'src/app/api/searchspec.service';
import { SpecService } from 'src/app/api/spec.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';

@Component({
  selector: 'xnode-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss'],
})
export class SpecificationsComponent implements OnInit, OnDestroy {
  currentUser: any;
  specData?: any;
  specDataCopy?: any;
  keyword: any;
  selectedSpec: any;
  selectedSection: any;
  specId: any;
  productStatusPopupContent: any;
  showSpecGenaretePopup: boolean = false;
  filteredSpecData: any;
  foundObjects: any[] = [];
  wantedIndexes: any[] = [];
  removableIndexes: any[] = [];
  isNaviOpened = false;
  isSideMenuOpened = true;
  product: any;
  isTheCurrentUserOwner: boolean = false;
  consversationList: any;
  contentData: any;
  noResults: boolean = false;
  useCases: any;
  specDataLatest?: any;
  versions: any;
  currentSpecVersionId: string = '';
  isDataManagementPersistence: boolean = false;
  loading: boolean = true;
  metaData: any;
  constructor(
    private utils: UtilsService,
    private apiService: ApiService,
    private specService: SpecService,
    private specUtils: SpecUtilsService,
    private router: Router,
    private auditUtil: AuditutilsService,
    private searchSpec: SearchspecService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.product = this.localStorageService.getItem(StorageKeys.Product);

    // if (this.product) {
    //   this.getMeStorageData();
    // }
    // this.utils.openSpecSubMenu.subscribe((data: any) => {
    //   this.isSideMenuOpened = data;
    // });
    // this.utils.openDockedNavi.subscribe((data: any) => {
    //   if (data) {
    //     this.utils.disableSpecSubMenu();
    //     this.isNaviOpened = true;
    //   }
    // });
  }

  ngOnInit(): void {
    this.getMeStorageData();
    this.route.queryParams.subscribe((params) => {
      const productId = params['product_id'];
      const templateId = params['template_id'];
      const templateType = params['template_type'];
      let deepLinkInfo = {
        product_id: productId,
        template_id: templateId,
        template_type: templateType,
      };
      if (
        templateType &&
        (templateType == 'COMMENT' || templateType == 'TASK')
      ) {
        this.getMetaData(deepLinkInfo);
      }
    });
  }


  getMetaData(val: any) {
    this.apiService
      .get('navi/get_metadata/' + this.currentUser?.email + '?product_id=' + val.product_id)
      .then((response) => {
        if (response?.status === 200 && response.data.data?.length) {
          let product = response.data.data[0];
          localStorage.setItem('record_id', product.id);
          localStorage.setItem('product', JSON.stringify(product));
          localStorage.setItem('app_name', product.title);
          localStorage.setItem('has_insights', product.has_insights);
          this.specUtils._openCommentsPanel(true);
          this.specUtils._tabToActive(val.template_type);
        }
      })
      .catch((error) => { });
  }

  storeProductInfoForDeepLink(key: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  getAllProductsInfo(key: string) {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(key);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  getDeepLinkInfo(key: string) {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(key);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  getMeStorageData(): void {
    this.currentUser = this.localStorageService.getItem(
      StorageKeys.CurrentUser
    );
    this.metaData = this.localStorageService.getItem(
      StorageKeys.MetaData
    );
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
      this.specData = this.localStorageService.getItem(StorageKeys.SpecData);
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

  getMeUserAvatar() {
    var firstLetterOfFirstWord =
      this.currentUser.first_name[0][0].toUpperCase(); // Get the first letter of the first word
    var firstLetterOfSecondWord =
      this.currentUser.last_name[1][0].toUpperCase(); // Get the first letter of the second word
    return firstLetterOfFirstWord + firstLetterOfSecondWord;
  }

  getMeSpecList(body?: any): void {
    this.utils.loadSpinner(true);
    let product = this.metaData.find((x: any) => x.id === body.productId);
    if (product.has_insights) {
      this.getMeSpecInfo(body);
    } else {
      this.showGenerateSpecPopup(product);
    }
  }

  getMeSpecInfo(body?: any) {
    this.utils.loadSpinner(true);
    this.specService
      .getSpec(body)
      .then((response) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          this.handleSpecData(response);
        }
        this.utils.loadSpinner(false);
        this.loading = false;
      })
      .catch((error) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.loading = false;
      });
  }

  showGenerateSpecPopup(product: any) {
    if (this.currentUser.email === product?.email) {
      this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = true;
      this.productStatusPopupContent =
        'No spec generated for this product. Do you want to generate Spec?';
    } else {
      this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = false;
      this.productStatusPopupContent =
        'No spec generated for this product. You don`t have access to create the spec. Product owner can create the spec.';
    }
  }

  clearSearchText() {
    this.specData = this.specDataCopy;
    this.keyword = '';
  }

  refreshCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  onSpecDataChange(data: any): void {
    this.getMeSpecList({
      versionId: data.versionId,
      productId: data.productId,
    });
  }

  deleteDataManagementPersistence(list: any) {
    if (this.isDataManagementPersistence) {
      list.forEach((obj: any, index: any) => {
        obj.content.forEach((elem: any, idx: any) => {
          if (elem.title === 'Data Management Persistence') {
            obj.content.splice(idx, 1);
          }
        });
      });
    }
  }

  handleSpecData(response: any): void {
    const list = response.data;
    list.forEach((obj: any) => {
      if (obj?.title == 'Functional Specifications') {
        obj.content.forEach((ele: any, idx: any) => {
          if (ele.title === 'Data Management Persistence') {
            this.isDataManagementPersistence = true;
          }
        });
      }
      if (obj?.title == 'Technical Specifications') {
        if (!Array.isArray(obj.content)) {
          obj.content = [];
        }
        obj.content.forEach((ele: any, idx: any) => {
          if (ele.title === 'Data Model Table Data') {
            obj.content.splice(idx, 1);
          }
          if (ele.title === 'Data Model') {
            this.deleteDataManagementPersistence(list);
          }
        });
        obj.content.push({
          title: 'OpenAPI Spec',
          content: [],
          id: 'open-api-spec',
        });
      }
      if (obj?.title == 'Quality Assurance') {
        let content = obj.content;
        content.forEach((useCase: any) => {
          if (useCase['Test Cases']) {
            useCase.TestCases = useCase['Test Cases'];
            delete useCase['Test Cases'];
            useCase.TestCases.forEach((testCase: any) => {
              testCase.TestCases = testCase['Test Cases'];
              delete testCase['Test Cases'];
            });
          }
        });

        if (Array.isArray(obj.content)) {
          obj.content = [];
        }

        obj.content.push({
          title: 'Test Cases',
          content: content,
          id: obj.id,
        });
      }
    });
    // this.specDataCopy = list;
    // localStorage.setItem('selectedSpec', JSON.stringify(list[0]));
    this.specData = list;
    // this.localStorageService.saveItem(StorageKeys.SpecData, list);
    // this.utils.passSelectedSpecItem(list);
    this.utils.loadSpinner(false);
  }

  checkUserEmail(): void {
    if (this.currentUser.email === this.product.email) {
      // this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = true;
      this.productStatusPopupContent =
        ' Do you want to regenerate Spec for this product?';
    } else {
      // this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = false;
      this.productStatusPopupContent =
        'No spec generated for this product. You don`t have access to create the spec. Product owner can create the spec.';
    }
  }

  generateSpec(): void {
    this.getPreviousCoversation();
  }

  getPreviousCoversation(): void {
    this.utils.loadSpinner(true);
    this.apiService
      .get(
        'navi/get_conversation/' + this.product.email + '/' + this.product.id
      )
      .then((res: any) => {
        if (res.status === 200 && res.data) {
          this.consversationList = res.data?.conversation_history;
          this.generate();
        } else {
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: 'Network Error',
          });
        }
        this.utils.loadSpinner(false);
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

  generate() {
    const body = {
      email: this?.product.email,
      conversation_history: this.consversationList,
      product_id: this.product.id,
    };
    let detail = 'Generating spec for this app process is started.';
    this.showSpecGenaretePopup = false;
    this.apiService
      .postApi(body, 'specs/generate')
      .then((response: any) => {
        if (response) {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'GENERATE_SPEC_PRODUCT_ALERT_POPUP',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product.id
          );
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: detail,
          });
          this.auditUtil.postAudit('GENERATE_SPEC', 1, 'SUCCESS', 'user-audit');
        } else {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'GENERATE_SPEC_PRODUCT_ALERT_POPUP',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product.id
          );
          this.auditUtil.postAudit('GENERATE_SPEC', 1, 'FAILURE', 'user-audit');
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'An error occurred while publishing the product.',
          });
        }
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'POST',
          url: error?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'GENERATE_SPEC_PRODUCT_ALERT_POPUP',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product.id
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.auditUtil.postAudit('GENERATE_SPEC', 1, 'FAILURE', 'user-audit');
      });
  }

  ngOnDestroy(): void {
    // Don't remove this commented code
    // localStorage.removeItem('SPEC_DATA');
    localStorage.removeItem('selectedSpec');
    localStorage.removeItem('SPEC_VERISON');
    this.utils.saveProductDetails({});
    this.specUtils._openCommentsPanel(false);
  }

  _openAndGetComments(contendata: SpecContent) {
    this.contentData = { ...contendata };
  }
}
