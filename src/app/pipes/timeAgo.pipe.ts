import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    console.info('value in pipe: ', value);
    if (!value) return '';

    const currentDate = new Date();
    value = new Date(value);
    const timeDifference = currentDate.getTime() - value.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(monthsDifference / 12);

    if (secondsDifference < 60) {
      return 'Viewed less than a minute ago';
    } else if (minutesDifference < 60) {
      return `Viewed ${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''} ago`;
    } else if (hoursDifference < 24) {
      return `Viewed ${hoursDifference} hour${hoursDifference !== 1 ? 's' : ''} ago`;
    } else if (daysDifference < 30) {
      return `Viewed ${daysDifference} day${daysDifference !== 1 ? 's' : ''} ago`;
    } else if (monthsDifference < 12) {
      return `Viewed ${monthsDifference} month${monthsDifference !== 1 ? 's' : ''} ago`;
    } else {
      return `Viewed ${yearsDifference} year${yearsDifference !== 1 ? 's' : ''} ago`;
    }
  }
}
