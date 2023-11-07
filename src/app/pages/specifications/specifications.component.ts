import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as _ from "lodash";
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { SpecContent } from 'src/models/spec-content';
import { SearchspecService } from 'src/app/api/searchspec.service';

@Component({
  selector: 'xnode-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss']
})
export class SpecificationsComponent implements OnInit {
  currentUser: any;
  specData?: any;
  specDataCopy?: any;
  keyword: any;
  private specDataBool: boolean = true;
  selectedSpec: any;
  selectedSection: any;
  specId: any
  productStatusPopupContent: any;
  showSpecGenaretePopup: boolean = false;
  filteredSpecData: any;
  foundObjects: any[] = [];
  wantedIndexes: any[] = [];
  removableIndexes: any[] = [];
  isNaviOpened = false
  isSideMenuOpened = true
  product: any;
  isCommnetsPanelOpened?: boolean = false;
  isCRsPanelOpened: boolean = false;
  isTheCurrentUserOwner: boolean = false;
  isTheSpecGenerated?: boolean;
  consversationList: any;
  contentData: any;
  noResults: boolean = false;

  constructor(
    private utils: UtilsService,
    private apiService: ApiService,
    private router: Router,
    private auditUtil: AuditutilsService,
    private searchSpec: SearchspecService
  ) {
    this.utils.sidePanelChanged.subscribe((pnl: SidePanel) => {
      this.isCommnetsPanelOpened = pnl === SidePanel.Comments;
      this.isCRsPanelOpened = pnl === SidePanel.ChangeRequests;
    })
    this.utils.isInSameSpecPage.subscribe((res) => {
      if (res) {
        this.getMeSpecList();
      }
    });
    this.utils.getMeIfProductChanges.subscribe((info: boolean) => {
      console.log('info', info);

      if (info) {
        this.getMeStorageData();
      }
    })
  }

  ngOnInit(): void {
    console.log('spec');

    this.getMeStorageData();
  }

  getMeStorageData(): void {
    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isSideMenuOpened = data;
    })
    this.utils.openDockedNavi.subscribe((data: any) => {
      this.isNaviOpened = data;
      this.isCommnetsPanelOpened = false;
      if (data) {
        this.utils.disableSpecSubMenu();
      }
    })
    this.utils.disableDockedNavi();
    this.getMeSpecList();
    let user = localStorage.getItem('currentUser');
    if (user)
      this.currentUser = JSON.parse(user);
    let product = localStorage.getItem('product');
    if (product)
      this.product = JSON.parse(product);
  }

  searchText(keyword: any) {
    if (keyword === '') {
      this.clearSearchText();
      this.noResults = false;
      return
    } else {
      this.keyword = keyword;
      this.specData = [];
      this.foundObjects = [];
      this.filteredSpecData = [];
      this.wantedIndexes = [];
      this.removableIndexes = [];
      let specLocalStorage = localStorage.getItem('specData')
      if (specLocalStorage) {
        let parseData = JSON.parse(specLocalStorage);
        this.specData = parseData;
      }
      this.searchSpec.searchSpec(this.specData, keyword).subscribe((returnData: any) => {
        if (returnData) {
          this.specData = returnData.specData;
          this.foundObjects = returnData.foundObjects;
          this.noResults = returnData.noResults;
          this.filteredSpecData = returnData.filteredSpecData;
          this.wantedIndexes = returnData.wantedIndexes;
          this.removableIndexes = returnData.removableIndexes;
          this.utils.passSelectedSpecItem(this.specData)
        }
      });
    }
  }

  getMeUserAvatar() {
    var firstLetterOfFirstWord = this.currentUser.first_name[0][0].toUpperCase(); // Get the first letter of the first word
    var firstLetterOfSecondWord = this.currentUser.last_name[1][0].toUpperCase(); // Get the first letter of the second word
    return firstLetterOfFirstWord + firstLetterOfSecondWord
  }

  getMeSpecList(): void {
    this.utils.loadSpinner(true);
    this.apiService.getApi("specs/get/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response.data && Array.isArray(response.data?.content)) {
          this.isTheSpecGenerated = true;
          this.handleData(response);
        } else {
          this.isTheSpecGenerated = false;
          if (this.currentUser.email === this.product?.email) {
            this.showSpecGenaretePopup = true;
            this.isTheCurrentUserOwner = true;
            this.productStatusPopupContent = 'No spec generated for this product. Do you want to generate Spec?';
          } else {
            this.showSpecGenaretePopup = true;
            this.isTheCurrentUserOwner = false;
            this.productStatusPopupContent = 'No spec generated for this product. You don`t have access to create the spec. Product owner can create the spec.';
          }
          this.utils.loadSpinner(false);
        }
      }).catch(error => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
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
    if (response?.status === 200 && !response.data.detail) {
      const list = response.data.content;
      list.forEach((obj: any, index: any) => {
        if (obj?.title == 'Technical Specifications') {
          if (!Array.isArray(obj.content)) {
            obj.content = [];
          }
          obj.content.push({ title: 'OpenAPI Spec', content: [], id: "open-api-spec" })

        }
      })
      this.specDataCopy = list;
      this.specData = list;
      if (this.specDataBool) {
        let stringList = JSON.stringify([...list])
        localStorage.setItem('specData', stringList)
      }
      this.specDataBool = false;
      this.utils.passSelectedSpecItem(list);
    } else {
      this.productStatusPopupContent = 'No spec generated for this product. Do you want to generate Spec?';
      this.showSpecGenaretePopup = true;
    }
    this.utils.loadSpinner(false);
  }

  checkUserEmail(): void {
    if (this.currentUser.email === this.product.email) {
      this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = true;
      this.productStatusPopupContent = ' Do you want to regenerate Spec for this product?';

    } else {
      this.showSpecGenaretePopup = true;
      this.isTheCurrentUserOwner = false;
      this.productStatusPopupContent = 'No spec generated for this product. You don`t have access to create the spec. Product owner can create the spec.';
    }
  }

  generateSpec(): void {
    this.getPreviousCoversation();
  }

  getPreviousCoversation(): void {
    this.utils.loadSpinner(true);
    this.apiService.get('navi/get_conversation/' + this.product.email + '/' + this.product.id).then((res: any) => {
      if (res.status === 200 && res.data) {
        this.consversationList = res.data?.conversation_history;
        this.generate();
      } else {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: 'Network Error' });
      }
    }).catch((err: any) => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
    })
  }

  generate() {
    const body = {
      email: this?.product.email,
      conversation_history: this.consversationList,
      product_id: this.product.id
    }
    let detail = "Generating spec for this app process is started.";
    this.showSpecGenaretePopup = false;
    this.apiService.postApi(body, 'specs/generate').then((response: any) => {
      if (response) {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.postAudit('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'SUCCESS', 'user-audit', user_audit_body, this.currentUser.email, this.product.id);
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: detail });
        this.auditUtil.postAudit("GENERATE_SPEC", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.postAudit('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser.email, this.product.id);
        this.auditUtil.postAudit("GENERATE_SPEC", 1, 'FAILURE', 'user-audit');
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.postAudit('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser.email, this.product.id);
      this.utils.loadSpinner(false)
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      this.auditUtil.postAudit("GENERATE_SPEC", 1, 'FAILURE', 'user-audit');
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('specData')
  }

  _openAndGetComments(contendata: SpecContent) {
    this.contentData = { ...contendata };
  }

}
