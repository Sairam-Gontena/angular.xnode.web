import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchspecService {
  specData: any;
  foundObjects: any[] = [];
  filteredSpecData: any;
  noResults: boolean = false;
  wantedIndexes: any[] = [];
  removableIndexes: any[] = [];
  keyword:any;
  constructor() {}

  searchSpec(data: any, keyword: any): Observable<any> {
    this.foundObjects = [];
    this.filteredSpecData = [];
    this.wantedIndexes = [];
    this.removableIndexes = [];
    this.keyword = keyword;
    return new Observable((observer) => {
      this.filterSpecbyKeyword(data, keyword).subscribe(() => {
        let returnData = {
          specData: this.specData,
          foundObjects: this.foundObjects,
          filteredSpecData: this.filteredSpecData,
          noResults: this.noResults,
          wantedIndexes: this.wantedIndexes,
          removableIndexes: this.removableIndexes,
        };
        observer.next(returnData);
        observer.complete();
      });
    });
  }

  filterSpecbyKeyword(data: any, keyword: any): Observable<any> {
    return new Observable((observer) => {
      this.specData = data;
      this.specData.forEach((elem: any, index: any) => {
        if (typeof elem?.content == 'string') {
          if (
            elem?.title.toUpperCase().includes(keyword.toUpperCase()) ||
            elem?.content.toUpperCase().includes(keyword.toUpperCase())
          ) {
            this.foundObjects = _.uniq(_.concat(this.foundObjects, elem));
            this.filteredSpecData = _.uniq(
              _.concat(this.filteredSpecData, elem)
            );
          }
        }
        if (typeof elem?.content == 'object' && elem?.content.length > 0) {
          elem?.content.forEach((subElem: any) => {
            if(subElem?.content_data_type=="WORKFLOWS" || subElem?.content_data_type=="DASHBOARD" || subElem?.content_data_type=="DATA_MODEL"){
              return;
            }
            if (typeof subElem?.content == 'string') {
              if (
                subElem?.title.toUpperCase().includes(keyword.toUpperCase()) ||
                subElem?.content.toUpperCase().includes(keyword.toUpperCase())
              ) {
                this.foundObjects = _.uniq(
                  _.concat(this.foundObjects, subElem)
                );
                this.filteredSpecData = _.uniq(
                  _.concat(this.filteredSpecData, subElem)
                );
              }
            }
            if (typeof subElem?.content == 'object') {
              subElem?.content.forEach((subChild: any) => {
                if (typeof subChild?.content == 'string') {
                  if (
                    subChild?.title
                      .toUpperCase()
                      .includes(keyword.toUpperCase()) ||
                    subChild?.content
                      .toUpperCase()
                      .includes(keyword.toUpperCase())
                  ) {
                    this.foundObjects = _.uniq(
                      _.concat(this.foundObjects, subElem)
                    );
                    this.filteredSpecData = _.uniq(
                      _.concat(this.filteredSpecData, subElem)
                    );
                  }
                }
                if (typeof subChild == 'string') {
                  if (subChild?.toUpperCase().includes(keyword.toUpperCase())) {
                    this.foundObjects = _.uniq(
                      _.concat(this.foundObjects, subElem)
                    );
                    this.filteredSpecData = _.uniq(
                      _.concat(this.filteredSpecData, subElem)
                    );
                  }
                }
              });
            }
          });
        }
        if (index === this.specData.length - 1) {
          if (this.filteredSpecData.length > 0) {
            this.populatefilteredSpecData(this.filteredSpecData);
            this.noResults = false;
          } else {
            this.noResults = true;
          }
        }
      });
      observer.next();
      observer.complete();
    });
  }

  populatefilteredSpecData(list: any) {
    let deleteIndexes: any[] = [];
    this.wantedIndexes = [];
    this.removableIndexes = [];
    this.filteredSpecData = _.compact(list);
    this.specData.forEach((item: any, index: any) => {
      deleteIndexes = [];
      if (typeof item?.content == 'object' && item?.content.length > 0)
        item?.content.forEach((subitem: any, subindex: any) => {
          _.some(
            this.filteredSpecData,
            (filterdataelem: any, subelemIndex: any) => {
              if (_.isEqual(filterdataelem.title, subitem.title)) {
                deleteIndexes.push(subindex);
              }
            }
          );
        });
      if (deleteIndexes.length > 0) {
        this.wantedIndexes.push(index);
        this.deleteSpecData(index, deleteIndexes);
      } else {
        this.removableIndexes.push(index);
      }
    });
    _.pullAt(this.specData, this.removableIndexes);
  }

  deleteSpecData(index: any, indexes: any) {
    let itemArr: any[] = [];
    this.specData[index]?.content.forEach((item: any, itemindex: any) => {
      itemArr.push(itemindex);
    });
    let wantedArr = _.difference(itemArr, indexes);
    _.pullAt(this.specData[index]?.content, wantedArr);
  }

  getKeyword(){
    return this.keyword;
  }
}
