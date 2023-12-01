import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as _ from 'lodash';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { SpecContent } from 'src/models/spec-content';
import { SearchspecService } from 'src/app/api/searchspec.service';
import { SpecService } from 'src/app/api/spec.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';

@Component({
  selector: 'xnode-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss'],
})
export class SpecificationsComponent implements OnInit {
  currentUser: any;
  specData?: any;
  specDataCopy?: any;
  keyword: any;
  private specDataBool: boolean = true;
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
  isTheSpecGenerated?: boolean;
  consversationList: any;
  contentData: any;
  noResults: boolean = false;
  useCases: any;

  constructor(
    private utils: UtilsService,
    private apiService: ApiService,
    private specService: SpecService,
    private router: Router,
    private auditUtil: AuditutilsService,
    private searchSpec: SearchspecService,
    private localStorageService: LocalStorageService
  ) {
    this.utils.isInSameSpecPage.subscribe((res) => {
      if (res) {
        this.getMeSpecList();
        this.utils.loadSpinner(true);
      }
    });

    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isSideMenuOpened = data;
    });

    this.utils.openDockedNavi.subscribe((data: any) => {
      if (data) {
        this.utils.disableSpecSubMenu();
        this.isNaviOpened = true;
      }
    });

    this.utils.getMeProductDetails.subscribe((res: any) => {
      if (res && res?.id) {
        this.onChangeProduct(res);
      }
    });
  }

  ngOnInit(): void {
    this.utils.loadSpinner(true);
    this.getMeStorageData();
  }

  getMeStorageData(): void {
    this.currentUser = this.localStorageService.getItem(
      StorageKeys.CurrentUser
    );
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.getInsights();
  }

  getInsights() {
    this.apiService
      .get('navi/get_insights/' + this.product?.email + '/' + this.product?.id)
      .then((response: any) => {
        if (response?.status === 200) {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_RETRIEVE_INSIGHTS_BPMN',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          const data = Array.isArray(response?.data)
            ? response?.data[0]
            : response?.data;
          this.useCases = data?.usecase || [];
          this.getMeSpecList();
        } else {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_RETRIEVE_INSIGHTS_BPMN',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product?.id
          );
          this.utils.loadSpinner(false);
          this.utils.showProductStatusPopup(true);
        }
      })
      .catch((error: any) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_RETRIEVE_INSIGHTS_BPMN',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product?.id
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
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

  getMeSpecList(): void {
    this.utils.loadSpinner(true);
    this.specService
      .getSpec({ productId: localStorage.getItem('record_id'), live: true })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          this.isTheSpecGenerated = true;
          this.handleData(response);
        } else {
          this.isTheSpecGenerated = false;
          if (this.currentUser.email === this.product?.email) {
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
          this.utils.loadSpinner(false);
        }
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

  handleData(response: any): void {
    const list = response.data;
    list.forEach((obj: any, index: any) => {
      if (obj?.title == 'Technical Specifications') {
        if (!Array.isArray(obj.content)) {
          obj.content = [];
        }
        obj.content.push({
          title: 'OpenAPI Spec',
          content: [],
          id: 'open-api-spec',
        });
      }
    });
    this.specDataCopy = list;
    localStorage.setItem('selectedSpec', JSON.stringify(list[0]));
    this.specData = list;
    if (this.specDataBool) {
      this.localStorageService.saveItem(StorageKeys.SpecData, list);
    }
    this.specDataBool = false;
    this.utils.passSelectedSpecItem(list);
    this.utils.loadSpinner(false);
  }

  checkUserEmail(): void {
    if (this.currentUser.email === this.product.email) {
      this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = true;
      this.productStatusPopupContent =
        ' Do you want to regenerate Spec for this product?';
    } else {
      this.showSpecGenaretePopup = true;
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
    localStorage.removeItem('specData');
  }

  _openAndGetComments(contendata: SpecContent) {
    this.contentData = { ...contendata };
  }

  onChangeProduct(obj: any): void {
    this.showSpecGenaretePopup = false;
    this.specData = [];
    localStorage.setItem('record_id', obj?.id);
    localStorage.setItem('app_name', obj.title);
    localStorage.setItem(
      'product_url',
      obj.url && obj.url !== '' ? obj.url : ''
    );
    localStorage.setItem('product', JSON.stringify(obj));
    this.getMeStorageData();
  }
}
