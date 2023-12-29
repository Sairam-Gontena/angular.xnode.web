import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-diff-comp',
  templateUrl: './diff-comp.component.html',
  styleUrls: ['./diff-comp.component.scss']
})
export class DiffCompComponent implements OnInit {
  @Input() contentObj: any;
  @Input() diffObj: any;
  @Input() onDiff: boolean = false;
  ngOnInit(): void {
    console.log('contentObj', this.contentObj);

  }
  getType(content: any): string {
    return Array.isArray(content) ? 'array' : typeof content;
  }

  getClass() {
    return !this.onDiff ? '' : this.diffObj == 'REMOVED' || this.diffObj == 'ADDED' ? this.diffObj : this.getObjState()
  }

  getObjState() {
    if (this.diffObj == undefined) {
      return 'ADDED'
    }
    if (this.contentObj.id === this.diffObj.id) {
      if (this.contentObj.content === this.diffObj.content) {
        return ''
      }
      return 'MODIFIED'

    } else {
      return "ADDED"
    }
  }

  // TODO - NEED TO REFACTOR
  getRemovedItems(fromArray: any[], toArray: any[], isOnDiff: boolean = false) {
    console.log('isOnDiff:', isOnDiff)
    if (!isOnDiff) return undefined;
    const map: any = {}
    console.log('fromArray:', fromArray, "toArray:", toArray)
    const removedItems: any[] = []
    for (const item of toArray) {
      map[item.id] = item;
    }

    for (const item of fromArray) {
      if (!map[item.id]) {
        removedItems.push(item)
      }
    }
    console.log('removedItems:', removedItems)
    return removedItems;
  }



  getDiffObj(fromArray: any[], srcObj: any, isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    for (const item of fromArray) {
      if (srcObj.id === item.id) {
        return item;
      }
    }
    return undefined;
  }

}
