import { Component, Input } from '@angular/core';
@Component({
  selector: 'xnode-diff-list',
  templateUrl: './diff-list.component.html',
  styleUrls: ['./diff-list.component.scss']
})
export class DiffListComponent {
  @Input() onDiff: boolean = false;
  @Input() srcList: any[] = [];
  @Input() targetList: any[] = [];
  @Input() users:any=[];
  @Input() reveiwerList:any=[];

  constructor() {
  }

  getListNotInSource(fromArray: any[], toArray: any[], isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    const map: any = {};
    const list: any[] = [];
    // console.log(fromArray, 'toArray', toArray)
    if (!Array.isArray(fromArray) || !Array.isArray(toArray)) { return undefined }
    for (const item of toArray) {
      map[item.id] = item;
    }

    for (const item of fromArray) {
      if (!map[item.id]) {
        list.push(item);
      }
    }
    // console.log('Diff List:', list)
    return list;
  }
}
