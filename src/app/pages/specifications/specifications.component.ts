import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as _ from "lodash";
import { AuditutilsService } from 'src/app/api/auditutils.service';

@Component({
  selector: 'xnode-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.scss']
})
export class SpecificationsComponent implements OnInit {
  currentUser: any;
  specData?: any;
  specDataCopy?: any;
  private specDataBool: boolean = true;
  selectedSpec: any;
  selectedSection: any;
  specId: any
  productStatusPopupContent: any;
  showSpecGenaretePopup: any;
  filteredSpecData: any;
  foundObjects: any[] = [];
  wantedIndexes: any[] = [];
  removableIndexes: any[] = [];
  isNaviOpened = false
  isSideMenuOpened = true
  product: any;
  isCommnetsPanelOpened?: boolean = false;
  isTheCurrentUserOwner: boolean = false;
  isTheSpecGenerated?: boolean;
  consversationList: any;

  constructor(
    private utils: UtilsService,
    private apiService: ApiService,
    private router: Router,
    private auditUtil: AuditutilsService
  ) {
    this.utils.isCommentPanelToggled.subscribe((event: any) => {
      this.isCommnetsPanelOpened = event;
    })
  }

  ngOnInit(): void {
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
    this.getMeSpecList();
    let user = localStorage.getItem('currentUser');
    if (user)
      this.currentUser = JSON.parse(user);
    let product = localStorage.getItem('product');
    if (product)
      this.product = JSON.parse(product);
  }

  searchText(keyword: any) {
    if (keyword == '') {
      this.clearSearchText();
      return
    }
    this.filteredSpecData = [];
    this.specData = [];
    this.foundObjects = [];
    let specLocalStorage = localStorage.getItem('specData')
    if (specLocalStorage) {
      let parseData = JSON.parse(specLocalStorage);
      this.specData = parseData;
    }
    this.specData.forEach((elem: any, index: any) => {
      if (typeof (elem?.content) == 'string') {
        if (elem?.title.toUpperCase().includes(keyword.toUpperCase()) || elem?.content.toUpperCase().includes(keyword.toUpperCase())) {
          this.foundObjects = _.uniq(_.concat(this.foundObjects, elem))
          this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, elem))
        }
      }
      if (typeof (elem?.content) == 'object' && elem?.content.length > 0) {
        elem?.content.forEach((subElem: any) => {
          if (typeof (subElem?.content) == 'string') {
            if (subElem?.title.toUpperCase().includes(keyword.toUpperCase()) || subElem?.content.toUpperCase().includes(keyword.toUpperCase())) {
              this.foundObjects = _.uniq(_.concat(this.foundObjects, subElem))
              this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElem))
            }
          }
          if (typeof (subElem?.content) == 'object') {
            subElem?.content.forEach((subChild: any) => {
              if (typeof (subChild?.content) == 'string') {
                if (subChild?.title.toUpperCase().includes(keyword.toUpperCase()) || subChild?.content.toUpperCase().includes(keyword.toUpperCase())) {
                  this.foundObjects = _.uniq(_.concat(this.foundObjects, subElem))
                  this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElem))
                }
              }
              if (typeof (subChild) == 'string') {
                if (subChild?.toUpperCase().includes(keyword.toUpperCase())) {
                  this.foundObjects = _.uniq(_.concat(this.foundObjects, subElem))
                  this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElem))
                }
              }
            });
          }
        });
      }
      if (index === this.specData.length - 1) {
        this.populatefilteredSpecData(this.filteredSpecData)
      }
    });
  }

  populatefilteredSpecData(list: any) {
    let deleteIndexes: any[] = [];
    this.wantedIndexes = [];
    this.removableIndexes = [];
    this.filteredSpecData = _.compact(list);
    this.specData.forEach((item: any, index: any) => {
      deleteIndexes = [];
      if (typeof (item?.content) == 'object' && item?.content.length > 0)
        item?.content.forEach((subitem: any, subindex: any) => {
          _.some(this.filteredSpecData, (filterdataelem: any, subelemIndex: any) => {
            if (_.isEqual(filterdataelem.title, subitem.title)) {
              deleteIndexes.push(subindex);
            }
          });
        });
      if (deleteIndexes.length > 0) {
        this.wantedIndexes.push(index)
        this.deleteSpecData(index, deleteIndexes)
      } else {
        this.removableIndexes.push(index)
      }
    });
    _.pullAt(this.specData, this.removableIndexes);
    let speclist = this.specData;
    this.utils.passSelectedSpecItem(speclist);
  }

  deleteSpecData(index: any, indexes: any) {
    let itemArr: any[] = [];
    this.specData[index]?.content.forEach((item: any, itemindex: any) => {
      itemArr.push(itemindex)
    });
    let wantedArr = _.difference(itemArr, indexes);
    _.pullAt(this.specData[index]?.content, wantedArr);
  }

  getMeUserAvatar() {
    var firstLetterOfFirstWord = this.currentUser.first_name[0][0].toUpperCase(); // Get the first letter of the first word
    var firstLetterOfSecondWord = this.currentUser.last_name[1][0].toUpperCase(); // Get the first letter of the second word
    return firstLetterOfFirstWord + firstLetterOfSecondWord
  }

  getMeSpecList(): void {
    this.utils.loadSpinner(true);
    this.apiService.getApi("specs/retrieve/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response.data && Array.isArray(response.data?.content)) {
          this.isTheSpecGenerated = true;
          this.handleData(response);
        } else {
          this.isTheSpecGenerated = false;
          if (this.currentUser.email === this.product.email) {
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
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
      });
  }

  clearSearchText() {
    this.getMeSpecList();
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
    this.apiService.get('/get_conversation/' + this.product.email + '/' + this.product.id).then((res: any) => {
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
        this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'SUCCESS', 'user-audit', user_audit_body, this.currentUser.email, this.product.id);
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: detail });
        this.auditUtil.post("GENERATE_SPEC", 1, 'SUCCESS', 'user-audit');
      } else {
        let user_audit_body = {
          'method': 'POST',
          'url': response?.request?.responseURL,
          'payload': body
        }
        this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser.email, this.product.id);
        this.auditUtil.post("GENERATE_SPEC", 1, 'FAILURE', 'user-audit');
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'An error occurred while publishing the product.' });
      }
    }).catch(error => {
      let user_audit_body = {
        'method': 'POST',
        'url': error?.request?.responseURL,
        'payload': body
      }
      this.auditUtil.post('GENERATE_SPEC_PRODUCT_ALERT_POPUP', 1, 'FAILED', 'user-audit', user_audit_body, this.currentUser.email, this.product.id);
      this.utils.loadSpinner(false)
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      this.auditUtil.post("GENERATE_SPEC", 1, 'FAILURE', 'user-audit');
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('specData')
  }

}
