import { Component, Input } from '@angular/core';

@Component({
  selector: 'xnode-diff-comp',
  templateUrl: './diff-comp.component.html',
  styleUrls: ['./diff-comp.component.scss']
})
export class DiffCompComponent {
  @Input() contentObj:any;
  @Input() diffObj:any;
  @Input() onDiff:boolean = false;

  getType(content:any):string{
      return Array.isArray(content) ?'array' :typeof content;
  }

  getClass(){
   return !this.onDiff ? '' : this.diffObj == 'REMOVED' || this.diffObj == 'ADDED' ? this.diffObj : this.getObjState()
  }

  getObjState(){
    if(this.diffObj == undefined) {
      return 'ADDED'
    }
    if(this.contentObj.title ===  this.diffObj.title) {
      if(this.contentObj.content ===  this.diffObj.content) {
        return ''
      }
      return 'MODIFIED'

    } else {
      return "ADDED"
    }
  }

  // TODO - NEED TO REFACTOR
  getRemovedItems(fromArray:any[], toArray:any[], isOnDiff:boolean = false){
    console.log('isOnDiff:',isOnDiff )
    if(!isOnDiff) return undefined;
    const map:any = {}
    console.log('fromArray:', fromArray ,"toArray:", toArray)
    const removedItems:any[] = []
    for (const item of toArray) {
      map[item.title] = item;
    }

    for (const item of fromArray) {
      if(!map[item.title]){
        removedItems.push(item)
      }
    }
    console.log('removedItems:',removedItems)
    return removedItems;
  }



getDiffObj(fromArray: any[], srcObj: any, isOnDiff: boolean = false) {
  if (!isOnDiff) return undefined;
  for (const item of fromArray) {
    if (srcObj.title === item.title) {
      return item;
    }
  }
  return undefined;
}

}
