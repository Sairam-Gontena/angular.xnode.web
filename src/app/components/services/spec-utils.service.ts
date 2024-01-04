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

  private activeTab: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public tabToActive: Observable<string> = this.activeTab.asObservable();

  private commentsCrActiveTab: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public getMeCommentsCrActiveTab: Observable<boolean> =
    this.commentsCrActiveTab.asObservable();

  private activateMainTab: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  public loadActiveTab: Observable<any> = this.activateMainTab.asObservable();

  private saveSpecVersion: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  public getMeSpecVersion: Observable<any> =
    this.saveSpecVersion.asObservable();

  private getLatestCrList: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public getMeCrList: Observable<string> = this.getLatestCrList.asObservable();

  private updateProduct: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeUpdatedProduct: Observable<string> =
    this.updateProduct.asObservable();

  private getMeSpec: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public getSpecBasedOnVersionID: Observable<any> =
    this.getMeSpec.asObservable();

  private onProductDropdownChange: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public getMeProductDropdownChange: Observable<boolean> =
    this.onProductDropdownChange.asObservable();

  private commentPaneltoSpecConversation = new Subject<any>();
  private commentPaneltoSpecConversationByUsers = new Subject<any>();

  private taskPaneltoTaskList = new Subject<any>();
  private taskPaneltoTaskListByUsers = new Subject<any>();

  specConversationPanelFrom:string='';

  changeSpecConversationPanelFrom(event: string) {
    this.specConversationPanelFrom = event;
  }

  _openCommentsPanel(event: boolean): void {
    this.openPanel.next(event);
  }

  _tabToActive(event: string): void {
    this.activeTab.next(event);
  }

  _commentsCrActiveTab(event: boolean): void {
    this.commentsCrActiveTab.next(event);
  }
  _productDropdownChanged(event: boolean): void {
    this.onProductDropdownChange.next(event);
  }

  _getSpecBasedOnVersionID(event: string): void {
    this.getMeSpec.next(event);
  }

  _updatedSelectedProduct(event: any): void {
    this.updateProduct.next(event);
  }

  _saveSpecVersion(event: any): void {
    this.saveSpecVersion.next(event);
  }

  _getLatestCrList(event: any): void {
    this.getLatestCrList.next(event);
  }

  _loadActiveTab(event: any): void {
    this.activateMainTab.next(event);
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

}
