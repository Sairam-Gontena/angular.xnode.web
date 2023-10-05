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

  private productAlertPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public getMeproductAlertPopup: Observable<boolean> = this.productAlertPopup.asObservable();

  private popupToShow: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public getMeFeedbackPopupTypeToDisplay: Observable<string> = this.popupToShow.asObservable();

  private limitReachedPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public handleLimitReachedPopup: Observable<boolean> = this.limitReachedPopup.asObservable();

  private reload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public getMeUpdatedList: Observable<boolean> = this.reload.asObservable();


  private specItem: BehaviorSubject<Object> = new BehaviorSubject<Object>(false);
  public getMeSpecItem: Observable<Object> = this.specItem.asObservable();

  private specItemIndex: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeSpecItemIndex: Observable<any> = this.specItemIndex.asObservable();

  private sectionIndex: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeSectionIndex: Observable<any> = this.sectionIndex.asObservable();

  private expandSpecSection: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public isSpecCollapsed: Observable<any> = this.expandSpecSection.asObservable();

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

  toggleProductAlertPopup(event: any): void {
    this.productAlertPopup.next(event);
  }

  showFeedbackPopupByType(event: any): void {
    this.popupToShow.next(event);
  }

  showLimitReachedPopup(event: any): void {
    this.limitReachedPopup.next(event);
  }
  reloadList(event: any): void {
    this.reload.next(event);
  }

  passSelectedSpecItem(event: any): void {
    this.specItem.next(event);
  }

  passSelectedSpecIndex(event: any): void {
    this.specItemIndex.next(event);
  }

  passSelectedSectionIndex(event: any): void {
    this.sectionIndex.next(event);
  }

  collapseSpecSection(event: any): void {
    this.expandSpecSection.next(event);
  }







  calculateTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}days`;
    } else if (hours > 0) {
      return `${hours}hours`;
    } else if (minutes > 0) {
      return `${minutes}minutes`;
    } else {
      return `${seconds}seconds`;
    }
  }
}
