import { Pipe, PipeTransform } from '@angular/core';
import { UserMin } from '../models/interfaces/user-min';

@Pipe({
  name: 'userInitials'
})
export class UserInitialsPipe implements PipeTransform {

  transform(value: UserMin, args?: any): any {

    const firstName = value?.firstName || value?.first_name;
    const lastName = value?.lastName || value?.last_name;

    return `${firstName?.slice(0, 1)}${lastName?.slice(0, 1)}`?.toUpperCase();
  }

}
