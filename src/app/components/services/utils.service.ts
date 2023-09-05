import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  private showLayoutSubmenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public openSubmenu: Observable<boolean> = this.showLayoutSubmenu.asObservable();

  private showSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public startSpinner: Observable<boolean> = this.showSpinner.asObservable();

  private showToaster: BehaviorSubject<Object> = new BehaviorSubject<Object>(false);
  public getMeToastObject: Observable<Object> = this.showToaster.asObservable();

  private loginUser: BehaviorSubject<Object> = new BehaviorSubject<Object>(false);
  public getMeLoginUser: Observable<Object> = this.loginUser.asObservable();

  private productStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public getMeProductStatus: Observable<boolean> = this.productStatus.asObservable();

  private popupToShow: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public getMeFeedbackPopupTypeToDisplay: Observable<string> = this.popupToShow.asObservable();

  constructor() { }

  disablePageToolsLayoutSubMenu() {
    this.showLayoutSubmenu.next(false);
  }

  EnablePageToolsLayoutSubMenu() {
    this.showLayoutSubmenu.next(true);
  }

  loadSpinner(event: boolean): void {
    this.showSpinner.next(event);
  }

  loadToaster(obj: any): void {
    this.showToaster.next(obj);
  }

  loadLoginUser(obj: any): void {
    this.loginUser.next(obj);
  }

  showProductStatusPopup(event: any): void {
    this.productStatus.next(event);
  }
  showFeedbackPopupByType(event: any): void {
    this.popupToShow.next(event);
  }

}
