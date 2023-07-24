import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private showLayoutSubmenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public openSubmenu: Observable<boolean> = this.showLayoutSubmenu.asObservable();
  constructor() { }

  disablePageToolsLayoutSubMenu() {
    this.showLayoutSubmenu.next(false);
  }

  EnablePageToolsLayoutSubMenu() {
    this.showLayoutSubmenu.next(true);
  }
}
