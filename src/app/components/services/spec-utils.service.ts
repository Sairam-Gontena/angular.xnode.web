import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecUtilsService {
  private openPanel: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public openCommentsPanel: Observable<boolean> = this.openPanel.asObservable();

  private activeTab: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public tabToActive: Observable<any> = this.activeTab.asObservable();

  private showSpecLevelCommentsTask: BehaviorSubject<any> =
    new BehaviorSubject<any>(false);
  public getMeSpecLevelCommentsTask: Observable<any> =
    this.showSpecLevelCommentsTask.asObservable();

  private shareNewComments: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  public getMeUpdatedComments: Observable<any> =
    this.shareNewComments.asObservable();

  private shareNewTasks: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeUpdatedTasks: Observable<any> = this.shareNewTasks.asObservable();

  private shareNewCrs: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeUpdatedCrs: Observable<any> = this.shareNewCrs.asObservable();

  private activateMainTab: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  public loadActiveTab: Observable<any> = this.activateMainTab.asObservable();

  private getLatestCrList: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public getMeCrList: Observable<any> = this.getLatestCrList.asObservable();

  private closeNavi: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public closeNaviWindow: Observable<boolean> = this.closeNavi.asObservable();

  private updateProduct: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeUpdatedProduct: Observable<string> =
    this.updateProduct.asObservable();

  private getMeSpec: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public getSpecBasedOnVersionID: Observable<any> =
    this.getMeSpec.asObservable();

  private updateLatestVersions: BehaviorSubject<any> = new BehaviorSubject<any>(
    ''
  );
  public getLatestSpecVersions: Observable<any> =
    this.updateLatestVersions.asObservable();

  private onProductDropdownChange: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public getMeProductDropdownChange: Observable<boolean> =
    this.onProductDropdownChange.asObservable();

  private commentPaneltoSpecConversation = new Subject<any>();
  private commentPaneltoSpecConversationByUsers = new Subject<any>();

  private taskPaneltoTaskList = new Subject<any>();
  private taskPaneltoTaskListByUsers = new Subject<any>();

  private specVersionChanged: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isSpecVersionChanged: Observable<boolean> =
    this.specVersionChanged.asObservable();

  private saveTab: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public subscribeAtivatedTab: Observable<string> = this.saveTab.asObservable();

  specConversationPanelFrom: string = '';

  changeSpecConversationPanelFrom(event: string) {
    this.specConversationPanelFrom = event;
  }

  _openCommentsPanel(event: boolean): void {
    this.openPanel.next(event);
  }

  _tabToActive(event: any): void {
    this.activeTab.next(event);
  }

  _getMeSpecLevelCommentsTask(event: any): void {
    this.showSpecLevelCommentsTask.next(event);
  }

  _getMeUpdatedComments(event: any): void {
    this.shareNewComments.next(event);
  }

  _getMeUpdatedTasks(event: any): void {
    this.shareNewTasks.next(event);
  }

  _getMeUpdatedCrs(event: any): void {
    this.shareNewCrs.next(event);
  }

  _productDropdownChanged(event: boolean): void {
    this.onProductDropdownChange.next(event);
  }

  _getSpecBasedOnVersionID(event: any): void {
    this.getMeSpec.next(event);
  }

  _updatedSelectedProduct(event: any): void {
    this.updateProduct.next(event);
  }

  _getLatestCrList(event: any): void {
    this.getLatestCrList.next(event);
  }

  _closeNaviWindow(event: boolean): void {
    this.closeNavi.next(event);
  }

  _loadActiveTab(event: any): void {
    this.activateMainTab.next(event);
  }

  _isTheSpecVersionChanged(event: boolean): void {
    this.specVersionChanged.next(event);
  }

  _getLatestSpecVersions(event: any): void {
    this.updateLatestVersions.next(event);
  }

  sendCommentSearchByKeywordListData(data: any) {
    this.commentPaneltoSpecConversation.next(data);
  }

  getCommentSearchByKeywordListData(): Observable<any> {
    return this.commentPaneltoSpecConversation.asObservable();
  }

  sendCommentSearchByUsersListData(data: any) {
    this.commentPaneltoSpecConversationByUsers.next(data);
  }

  getCommentSearchByUsersListData(): Observable<any> {
    return this.commentPaneltoSpecConversationByUsers.asObservable();
  }

  sendTaskPanelSearchByKeywordTaskList(data: any) {
    this.taskPaneltoTaskList.next(data);
  }

  getTaskPanelSearchByKeywordTaskList(): Observable<any> {
    return this.taskPaneltoTaskList.asObservable();
  }

  sendTaskPanelSearchByUsersListData(data: any) {
    this.taskPaneltoTaskListByUsers.next(data);
  }

  getTaskPanelSearchByUsersListData(): Observable<any> {
    return this.taskPaneltoTaskListByUsers.asObservable();
  }

  saveActivatedTab(data: any) {
    this.saveTab.next(data);
  }
}
