import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  private showLayoutSubmenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private specSubMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private dockedNavi: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public openSubmenu: Observable<boolean> = this.showLayoutSubmenu.asObservable();
  public openSpecSubMenu: Observable<boolean> = this.specSubMenu.asObservable();
  public openDockedNavi: Observable<boolean> = this.dockedNavi.asObservable();

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

  private sectionIndex: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeSectionIndex: Observable<any> = this.sectionIndex.asObservable();

  private showCommentPanel: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public isCommentPanelToggled: Observable<any> = this.showCommentPanel.asObservable();


  private selectedSection: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeSelectedSection: Observable<any> = this.selectedSection.asObservable();
  private productId: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeProductId: Observable<any> = this.productId.asObservable();
  private productEditPermission: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public hasProductEditPermission: Observable<any> = this.productEditPermission.asObservable();

  constructor() { }

  disablePageToolsLayoutSubMenu() {
    this.showLayoutSubmenu.next(false);
  }
  disableSpecSubMenu() {
    this.specSubMenu.next(false);
  }
  disableDockedNavi() {
    this.dockedNavi.next(false);
  }

  EnablePageToolsLayoutSubMenu() {
    this.showLayoutSubmenu.next(true);
  }
  EnableSpecSubMenu() {
    this.specSubMenu.next(true);
  }
  EnableDockedNavi() {
    this.dockedNavi.next(true);
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

  passSelectedSectionIndex(event: any): void {
    this.sectionIndex.next(event);
  }

  openCommentPanel(event: any): void {
    this.showCommentPanel.next(event);
  }
  saveProductId(event: any): void {
    this.productId.next(event);
  }
  hasProductPermission(event: any): void {
    this.productEditPermission.next(event);
  }


  saveSelectedSection(event: any): void {
    this.selectedSection.next(event);
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
