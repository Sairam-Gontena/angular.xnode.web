import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {

  getStatusTextColor(status: string) {
    let colorCode = '';
    if (status.toLowerCase() === 'active') {
      colorCode = '#11CF46';
    } if (status.toLowerCase() === 'closed') {
      colorCode = '#A2A2A3';
    } if (status.toLowerCase() === 'Locked') {
      colorCode = '#FFE047';
    } if (status.toLowerCase() === 'new') {
      colorCode = '#EFEEEE';
    } if (status.toLowerCase() === 'archived') {
      colorCode = '#FF6847';
    } if (status.toLowerCase() === 'linked' || status.toLowerCase() === 'open') {
      colorCode = '#02ADEE';
    }
    return colorCode;
  }
}
