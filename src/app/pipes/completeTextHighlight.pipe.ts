import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'completetexthighlight'
})
export class CompleteTextHighlightPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) { }

    transform(list: any, searchText: string): any {
        const regExp = new RegExp(searchText, 'gi');
        const highlightedValue = list?.replace(regExp, (match: any) => `<span class='yellow'>${match}</span>`);
        const safeHtml = this._sanitizer.sanitize(SecurityContext.HTML, highlightedValue);
        return this._sanitizer.bypassSecurityTrustHtml(safeHtml || '');
    }
}
