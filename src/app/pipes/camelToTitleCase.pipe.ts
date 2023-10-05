import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'camelToTitle'
})
export class CamelToTitlePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return value;
        return value
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }
}