import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  specDataCopy: any;
  selectedSpec: any;
  selectedSection: any;
  specId: any
  productStatusPopupContent: any;
  showSpecGenaretePopup: any;
  filteredSpecData: any;
  foundObjects: any[] = [];
  isNaviOpened = false;
  product: any;
  isSideMenuOpened = true;
  isCommnetsPanelOpened?: boolean = false;
  isTheCurrentUserOwner: boolean = false;
  isTheSpecGenerated?: boolean;
  consversationList: any;

  constructor(
    private utils: UtilsService,
    private apiService: ApiService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
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

  searchText(text: any) {
    if (text == '') {
      this.clearSearchText()
    }
    let filteredData: any = [];
    let keyword = text;
    this.specData.forEach((element: any, index: any) => {
      element.section.forEach((subElement: any) => {
        if (typeof (subElement.content) == 'string') {
          if (subElement.title.toUpperCase().includes(keyword.toUpperCase()) || subElement.content.toUpperCase().includes(keyword.toUpperCase())) {
            this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
            this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
          }
        } if (typeof (subElement.content) == 'object') {
          subElement.content.forEach((objElem: any) => {
            if (typeof (objElem) == 'string') {
              if (objElem?.toUpperCase().includes(keyword.toUpperCase())) {
                this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
              }
            }
            if (objElem?.title || objElem?.content) {
              if (typeof (objElem?.content) == 'object') {
                if (objElem?.content?.Description) {
                  if (objElem?.content?.Description.toUpperCase().includes(keyword.toUpperCase())) {
                    this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                    this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
                  }
                }
                if (objElem?.content?.length > 0) {
                  objElem?.content.forEach((item: any) => {
                    if (item?.tableName) {
                      if (item?.tableName.toUpperCase().includes(keyword.toUpperCase()) || item?.tableDescription.toUpperCase().includes(keyword.toUpperCase())) {
                        this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                        this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
                      }
                    } else if (item?.columnName) {
                      if (item?.columnName.toUpperCase().includes(keyword.toUpperCase()) || item?.description.toUpperCase().includes(keyword.toUpperCase())) {
                        this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                        this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
                      }
                    } else if (item?.checkName) {
                      if (item?.checkName.toUpperCase().includes(keyword.toUpperCase()) || item?.description.toUpperCase().includes(keyword.toUpperCase())) {
                        this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                        this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
                      }
                    } else if (item?.content) {
                      if (item?.content.toUpperCase().includes(keyword.toUpperCase()) || item?.title.toUpperCase().includes(keyword.toUpperCase())) {
                        this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                        this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
                      }
                    } else {
                      if (item?.toUpperCase().includes(keyword.toUpperCase())) {
                        this.foundObjects = _.uniq(_.concat(this.foundObjects, objElem))
                        this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, objElem))
                      }
                    }
                  })
                }
              } else {
                if (objElem?.title?.toUpperCase().includes(keyword.toUpperCase()) || objElem?.content?.toUpperCase().includes(keyword.toUpperCase())) {
                  this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                  this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
                }
              }
            }
            if (objElem?.Backstory || objElem?.Needs || objElem?.Quote) {
              if (objElem?.Backstory.toUpperCase().includes(keyword.toUpperCase()) || objElem?.Needs.toUpperCase().includes(keyword.toUpperCase()) || objElem?.Quote.toUpperCase().includes(keyword.toUpperCase())) {
                this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement))
              }
            }
            if (objElem?.Definition || objElem?.Term)
              if (objElem?.Definition.toUpperCase().includes(keyword.toUpperCase()) || objElem?.Term.toUpperCase().includes(keyword.toUpperCase())) {
                this.foundObjects = _.uniq(_.concat(this.foundObjects, subElement))
                this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, subElement)) //element
              }
          })
        }
      });
      if (index === this.specData.length - 1) {
        this.populatefilteredSpecData(this.filteredSpecData)
      }
    });
  }

  populatefilteredSpecData(data: any) {
    this.filteredSpecData = _.compact(data);
    this.specData = this.filteredSpecData
    this.changeDetectorRef.detectChanges();
  }

  clearSearchText() {
    this.specData = this.specDataCopy;
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
        if (obj?.title && obj?.content && typeof (obj?.content) != 'object') {
          obj.content.forEach((element: any, sIndex: any) => {
            element.parentIndex = (index + 1).toString() + "." + (sIndex).toString()
          });
        }
      })
      this.specData = list;
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

}
