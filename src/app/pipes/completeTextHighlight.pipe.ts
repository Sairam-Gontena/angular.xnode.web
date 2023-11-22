import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'completetexthighlight'
})
export class CompleteTextHighlightPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) { }

    transform(list: any, searchText: string): any {

        if (!list) { return []; }
        if (!searchText) { return list; }
        let words = list.split(' ');

        let startIndex = words.findIndex((word:any) => word.includes(searchText.split(' ')[0]));

        let endIndex = words.findIndex((word:any) => word.includes(searchText.split(' ')[searchText.split(' ').length - 1]));

        let fullPhrase = words.slice(startIndex, endIndex + 1).join(' ');
        const value = list.replace(fullPhrase, `<span class='yellow' style='background-color:yellow'>${fullPhrase}</span>`);
        return value;
        // const value = list.replace(searchText, `<span class='yellow' style='background-color:yellow'>${searchText}</span>`);
        // const value = list.replace(fullWord, `<span class='yellow' style='background-color:yellow'>${fullWord}</span>`);
        // return value;
    }
}
