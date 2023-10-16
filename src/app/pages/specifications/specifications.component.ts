import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as _ from "lodash";

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
  isNaviOpened = false
  isSideMenuOpened = true

  constructor(
    private utils: UtilsService,
    private apiService: ApiService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isSideMenuOpened = data;
    })
    this.utils.openDockedNavi.subscribe((data: any) => {
      this.isNaviOpened = data;
      if (data) {
        this.utils.disableSpecSubMenu();
      }
    })
    let user = localStorage.getItem('currentUser');
    this.getMeSpecList();
    if (user)
      this.currentUser = JSON.parse(user)
  }

  searchText(keyword: any) {
    if (keyword == '') {
      this.clearSearchText()
    }
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
                      if (typeof (item) == 'object') {
                        if (Object.values(item).includes(keyword)) {
                          this.foundObjects = _.uniq(_.concat(this.foundObjects, objElem))
                          this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, objElem))
                        }
                      } else {
                        if (item.toUpperCase().includes(keyword.toUpperCase())) {
                          this.foundObjects = _.uniq(_.concat(this.foundObjects, objElem))
                          this.filteredSpecData = _.uniq(_.concat(this.filteredSpecData, objElem))
                        }
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
    // this.specData.forEach((element: any, index: any, arr: any) => {
    //   element.section.forEach((subelement: any, subindex: any, subarr: any) => {
    //     let lastIndex = false;
    //     index == arr.length - 1 && subindex == subarr.length - 1 ? lastIndex = true : lastIndex = false;
    //     this.checkKeyword(keyword, subelement, index, subindex, lastIndex)
    //   })
    // });
  }

  checkKeyword(keyword: any, subelement: any, index: any, subindex: any, lastIndex: boolean) {
    let objArr: any = [];
    if (typeof (subelement.content) == 'string') {
      if (Object.values(subelement).includes(keyword) == false) {
        _.pull(this.specData[index].section, this.specData[index].section[subindex])
      }
    }
    if (typeof (subelement.content) == 'object') {
      subelement.content.forEach((item: any, itemIndex: any) => {
        if (typeof (item) == 'object') {
          console.log('item', item)
          // item?.content.forEach((subitem: any) => {
          //   console.log('subitem val', Object.values(subitem))
          // })
        } else {
          if (Object.values(item).includes(keyword) == false) {
            objArr.push(itemIndex)
          }
        }
        if (Object.values(item).includes(keyword) == true) {
          console.log('true', item)
        }
        if (itemIndex == subelement.content.length - 1) {
          _.pullAt(this.specData[index]?.section[subindex]?.content, objArr);
        }
      });
    }
    if (lastIndex)
      this.deleteUnwantedData(this.specData);
  }

  deleteUnwantedData(data: any) {
    this.specData = data;
    console.log('data', this.specData)
    this.specData.forEach((element: any, index: any, item: any) => {
      let objArr: any = [];
      element.section.forEach((subelement: any, subindex: any, arr: any) => {
        if (subelement?.content?.length == 0) {
          objArr.push(subindex)
        }
        if (subindex == arr.length - 1) {
          _.pullAt(this.specData[index]?.section, objArr);
          // if (this.specData[index]?.section.length == 0)
          //   _.pullAt(this.specData, index);
          // console.log(item, this.specData, element.section, arr)
          // if (item.length - 1 == this.specData.length) {
          //   this.populatefilteredSpecData(this.specData)
          // }
        }
      });
    });
  }

  populatefilteredSpecData(list: any) {
    console.log('main data', this.specDataCopy)
    console.log('final specData', this.specData)
    this.filteredSpecData = _.compact(list);
    this.specData.forEach((item: any, index: any) => {
      item?.section.forEach((subitem: any, subindex: any) => {
        _.some(this.filteredSpecData, (elem: any, subelem: any) => {
          if (_.isEqual(elem.title, subitem.title)) {
            this.specData[index]?.section.forEach((pullItem: any, pullIndex: any) => {
              if (pullIndex != subindex) {
                console.log(pullItem)
                // _.pullAt(this.specData[index]?.section, pullIndex);
              }
            });
          }
        });
      });
    });
    console.log('filtered data', this.filteredSpecData)
    console.log('final specData', this.specData)
    // this.utils.passSelectedSpecItem(list);
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
        if (response?.status === 200 && !response.data.detail) {
          const list = response.data;
          list.forEach((obj: any, index: any) => {
            if (obj?.title && obj?.section) {
              if (obj?.title == 'Technical Specifications') {
                obj.section.push({ title: 'OpenAPI Spec', content: [], parentIndex: 4.10, contentType: 'OpenAPI', created_by: obj.created_by, created_on: obj.created_on, modified_by: obj.modified_by, modified_on: obj.modified_on })
              }
              obj.section.unshift({ title: obj.title, created_by: obj.created_by, created_on: obj.created_on, modified_by: obj.modified_by, modified_on: obj.modified_on })
              obj.section.forEach((element: any, sIndex: any) => {
                element.parentIndex = (index + 1).toString() + "." + (sIndex).toString()
              });
            }
          })
          this.specData = list;
          this.specData.pop();
          this.specDataCopy = this.specData;
          this.utils.passSelectedSpecItem(list);
        } else {
          this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data.detail });
          this.productStatusPopupContent = 'No spec generated for this product. Do you want to generate Spec?';
          this.showSpecGenaretePopup = true;
        }
        this.utils.loadSpinner(false);

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

}
