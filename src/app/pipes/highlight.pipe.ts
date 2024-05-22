import { Pipe, PipeTransform } from '@angular/core';
import { SearchspecService } from '../api/searchspec.service';
@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

    constructor( private searchSpec:SearchspecService) { }
    transform(list: any, searchText: string, titleString?:string): any {
        if (!list) { return []; }
        if (!searchText) {
          if(this.searchSpec.keyword!=''){searchText=this.searchSpec.keyword}else{return list}
        }
        if(list?.length>0 && searchText?.length>0){
          const value = list?.replace(searchText, `<span class='yellow' style='background-color:yellow'>${searchText}</span>`);
          return value;
        }else{
          if(titleString){
            let returnString = list.split('-');
            return returnString[1]
          } else return list;
        }
    }
}
