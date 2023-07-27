import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderDataService {
  private headerDataSubject = new BehaviorSubject<string>('Initial Value');

  headerData$ = this.headerDataSubject.asObservable();

  updateHeaderData(newValue: string) {
    this.headerDataSubject.next(newValue);
  }
}