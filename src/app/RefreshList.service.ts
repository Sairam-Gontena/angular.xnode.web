import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshListService {
  private headerDataSubject = new BehaviorSubject<string>('Initial Value');
  private adminUserListRefresh = new BehaviorSubject<boolean>(false);

  headerData$ = this.headerDataSubject.asObservable();

  updateData(newValue: string) {
    this.headerDataSubject.next(newValue);
  }


  toggleAdminUserListRefresh(): void {
    this.adminUserListRefresh.next(true);
  }

  RefreshAdminUserList() {
    return this.adminUserListRefresh.asObservable();
  }
}