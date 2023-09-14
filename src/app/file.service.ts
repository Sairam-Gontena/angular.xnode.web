import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor() { }

  base64ToFile(base64: string, fileName: string): Observable<File> {
    return new Observable((observer: Observer<File>) => {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' }); // Change the type accordingly

      const file = new File([blob], fileName, { type: blob.type });

      observer.next(file);
      observer.complete();
    });
  }
}
