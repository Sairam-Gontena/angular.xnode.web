import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'Accordionhighlight'
})
export class AccordionHighlightPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(html: string, keyword: string): SafeHtml {
        if (!html || !keyword) {
            return html;
        }
        const escapedKeyword = keyword.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        const highlighted = html.replace(new RegExp(escapedKeyword, 'gi'), (match) => {
            return `<span class='yellow'>${match}</span>`;
        });

        return this.sanitizer.bypassSecurityTrustHtml(highlighted);
    }

}