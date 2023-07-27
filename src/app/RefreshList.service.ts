import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshListService {
  private headerDataSubject = new BehaviorSubject<string>('Initial Value');

  headerData$ = this.headerDataSubject.asObservable();

  updateData(newValue: string) {
    this.headerDataSubject.next(newValue);
  }
}