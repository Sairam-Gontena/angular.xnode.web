import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { isArray } from 'lodash';

@Component({
  selector: 'xnode-diff-comp',
  templateUrl: './diff-comp.component.html',
  styleUrls: ['./diff-comp.component.scss'],
})
export class DiffCompComponent implements OnInit {
  product: any;
  @Input() contentObj: any;
  @Input() diffObj: any;
  @Input() onDiff: boolean = false;
  @Input() index: any;
  @Input() users: any = [];
  @Input() reveiwerList: any = [];
  @Input() specItemId: any;
  @Input() parentTitle: any;

  constructor(private storageService: LocalStorageService) {}

  ngOnInit(): void {
    console.log('contentObj============', this.contentObj);
    console.log('diffObj===========', this.diffObj);

    this.product = this.storageService.getItem(StorageKeys.Product);
  }

  getType(content: any): string {
    return Array.isArray(content) ? 'array' : typeof content;
  }

  getClass() {
    return !this.onDiff
      ? ''
      : this.diffObj == 'REMOVED' || this.diffObj == 'ADDED'
      ? this.diffObj
      : this.getObjState();
  }

  getObjState() {
    if (this.diffObj == undefined) {
      return 'ADDED';
    }
    if (this.contentObj.id === this.diffObj.id) {
      if (this.contentObj.content === this.diffObj.content) {
        return '';
      }
      return 'MODIFIED';
    } else {
      return 'ADDED';
    }
  }

  // TODO - NEED TO REFACTOR
  getRemovedItems(fromArray: any[], toArray: any[], isOnDiff: boolean = false) {
    console.log('isOnDiff:', isOnDiff);
    if (!isOnDiff) return undefined;
    const map: any = {};
    console.log('fromArray:', fromArray, 'toArray:', toArray);
    const removedItems: any[] = [];
    for (const item of toArray) {
      map[item.id] = item;
    }

    for (const item of fromArray) {
      if (!map[item.id]) {
        removedItems.push(item);
      }
    }
    console.log('removedItems:', removedItems);
    return removedItems;
  }

  getDiffObj(fromArray: any[], srcObj: any, isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    if (isArray(fromArray))
      for (const item of fromArray) {
        if (srcObj.id === item.id) {
          return item;
        }
      }
    return undefined;
  }

  getMeBanner(event: any) {
    return (
      './assets/' + event?.title?.toLowerCase()?.replace(/ /g, '') + '.svg'
    );
  }

  changeView(specItem: any): void {
    console.log('specItem', this.contentObj, specItem);
    this.contentObj.showTable = true;
  }
}
