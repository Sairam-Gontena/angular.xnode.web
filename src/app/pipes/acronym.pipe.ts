import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acronymPipe'
})
export class AcronymPipe implements PipeTransform {

  private colors: string[] = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];

  transform(value: string[]): { acronym: string, color: string }[] {
    if (!value || !Array.isArray(value)) {
      return [];
    }

    // return value.map(((item, index)) => {
    //   if (typeof item !== 'string') {
    //     return { acronym: '', color: '' };
    //   }

    //   const words = item.split(' ');
    //   words.map(word => word.charAt(0)).join('').toUpperCase();
    //   const color = this.colors[index % this.colors.length];

    //   return { acronym, color };
    // });

    return value.map((item, index) => {
      if (typeof item !== 'string') {
        return { acronym: '', color: '' };
      }

      const words = item.split(' ');
      const acronym = words.map(word => word.charAt(0)).join('').toUpperCase();
      const color = this.colors[index % this.colors.length];

      return { acronym, color };
    });
  }

}
