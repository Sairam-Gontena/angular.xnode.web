import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SidePanel } from 'src/models/side-panel.enum';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  currentUser?: User;
  private showLayoutSubmenu: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  private specSubMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  private dockedNavi: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public openSubmenu: Observable<boolean> =
    this.showLayoutSubmenu.asObservable();
  public openSpecSubMenu: Observable<boolean> = this.specSubMenu.asObservable();
  public openDockedNavi: Observable<boolean> = this.dockedNavi.asObservable();

  private showSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public startSpinner: Observable<boolean> = this.showSpinner.asObservable();

  private expandNavi: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public naviExpand: Observable<boolean> = this.expandNavi.asObservable();
  private showToaster: BehaviorSubject<Object> = new BehaviorSubject<Object>(
    false
  );
  public getMeToastObject: Observable<Object> = this.showToaster.asObservable();

  private loginUser: BehaviorSubject<Object> = new BehaviorSubject<Object>(
    false
  );
  public getMeLoginUser: Observable<Object> = this.loginUser.asObservable();

  private productStatus: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public getMeProductStatus: Observable<boolean> =
    this.productStatus.asObservable();

  private activeRoute: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isInProductContext: Observable<boolean> =
    this.activeRoute.asObservable();

  private productAlertPopup: BehaviorSubject<Object> =
    new BehaviorSubject<Object>({ popup: false, data: {} });
  public getMeproductAlertPopup: Observable<Object> =
    this.productAlertPopup.asObservable();

  private popupToShow: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public getMeFeedbackPopupTypeToDisplay: Observable<string> =
    this.popupToShow.asObservable();

  private summaryPopupStatus: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public getMeSummaryPopupStatus: Observable<boolean> =
    this.summaryPopupStatus.asObservable();

  private limitReachedPopup: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public handleLimitReachedPopup: Observable<boolean> =
    this.limitReachedPopup.asObservable();

  private reload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public getMeUpdatedList: Observable<boolean> = this.reload.asObservable();

  private specItem: BehaviorSubject<Object> = new BehaviorSubject<Object>(
    false
  );
  public getMeSpecItem: Observable<Object> = this.specItem.asObservable();
  private sectionIndex: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeSectionIndex: Observable<any> = this.sectionIndex.asObservable();

  private currentSidePanel: BehaviorSubject<SidePanel> =
    new BehaviorSubject<SidePanel>(SidePanel.None);
  public sidePanelChanged: Observable<SidePanel> =
    this.currentSidePanel.asObservable();

  private selectedSection: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  public getMeSelectedSection: Observable<any> =
    this.selectedSection.asObservable();
  private productId: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeProductId: Observable<any> = this.productId.asObservable();
  private productEditPermission: BehaviorSubject<any> =
    new BehaviorSubject<any>(false);
  public hasProductEditPermission: Observable<any> =
    this.productEditPermission.asObservable();
  private isInSpec: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public isInSameSpecPage: Observable<any> = this.isInSpec.asObservable();

  private updateConversation: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  public getMeLatestConversation: Observable<string> =
    this.updateConversation.asObservable();

  private loadIframeUrl: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public getLatestIframeUrl: Observable<boolean> =
    this.loadIframeUrl.asObservable();

  private saveComments: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public getMeUpdatedCommentList: Observable<any> =
    this.saveComments.asObservable();

  private productDetails: BehaviorSubject<Object> = new BehaviorSubject<Object>(
    {}
  );
  public getMeProductDetails: Observable<Object> =
    this.productDetails.asObservable();

  private assignAsTask: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public getMeTaskAssigned: Observable<boolean> =
    this.assignAsTask.asObservable();

  private selectedContent: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public clearSelectedContent: Observable<boolean> =
    this.selectedContent.asObservable();
  private productChangeBPMN = new Subject<any>();

  private viewSummary$: BehaviorSubject<any> =
    new BehaviorSubject<any>(false);
  public loadViewSummary: Observable<any> =
    this.viewSummary$.asObservable();

  private summaryObject: BehaviorSubject<Object> =
    new BehaviorSubject<Object>({ summary: {} });

  public getMeSummaryObject: Observable<Object> =
    this.summaryObject.asObservable();

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
  expandNavi$() {
    this.expandNavi.next(true);
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

  showSummaryPopup(event: any): void {
    this.summaryPopupStatus.next(event);
  }


  reloadList(event: any): void {
    this.reload.next(event);
  }

  passSelectedSpecItem(event: any): void {
    this.specItem.next(event);
  }

  openOrClosePanel(pnl: SidePanel): void {
    this.currentSidePanel.next(pnl);
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
  toggleSpecPage(event: any): void {
    this.isInSpec.next(event);
  }

  updateConversationList(event: any): void {
    this.updateConversation.next(event);
  }

  saveCommentList(event: any) {
    this.saveComments.next(event);
  }

  saveProductDetails(event: object): void {
    this.productDetails.next(event);
  }

  toggleTaskAssign(event: boolean): void {
    this.assignAsTask.next(event);
  }

  changeSelectContentChange(event: boolean): void {
    this.selectedContent.next(event);
  }

  productContext(event: boolean): void {
    this.activeRoute.next(event);
  }

  sendProductChangeBPMN(data: any) {
    this.productChangeBPMN.next(data);
  }

  getProductChangeBPMN(): Observable<any> {
    return this.productChangeBPMN.asObservable();
  }
  viewSummary(event: any): void {
    this.viewSummary$.next(event);
  }

  updateSummary(event: any): void {
    this.summaryObject.next(event);
  }

  prepareIframeUrl(data: any) {
    this.loadIframeUrl.next(data);
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

  setUsernameOrDP() {
    let data = localStorage.getItem('currentUser');
    let userDp: string = '';
    if (data) {
      this.currentUser = JSON.parse(data);
      if (this.currentUser?.image) {
        userDp = this.currentUser?.image;
      } else if (this.currentUser?.first_name && this.currentUser?.last_name) {
        userDp =
          this.currentUser.first_name.charAt(0).toUpperCase() +
          this.currentUser.last_name.charAt(0).toUpperCase();
      } else {
        userDp = '';
      }
    } else {
      userDp = '';
    }
    return userDp;
  }
}
