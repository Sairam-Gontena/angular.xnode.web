import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  private commentsCrActiveTab: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public getMeCommentsCrActiveTab: Observable<boolean> = this.commentsCrActiveTab.asObservable();

  private activateMainTab: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public loadActiveTab: Observable<any> = this.activateMainTab.asObservable();

  private saveSpecVersion: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public getMeSpecVersion: Observable<any> = this.saveSpecVersion.asObservable();

  private getLatestCrList: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public getMeCrList: Observable<string> = this.getLatestCrList.asObservable();

  private getMeSpec: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public getSpecBasedOnVersionID: Observable<any> = this.getMeSpec.asObservable();

  private onProductDropdownChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public getMeProductDropdownChange: Observable<boolean> = this.onProductDropdownChange.asObservable();

  specConversationPanelFrom:string='';

  changeSpecConversationPanelFrom(event:string){
    this.specConversationPanelFrom=event;
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

  _saveSpecVersion(event: any): void {
    this.saveSpecVersion.next(event);
  }

  _getLatestCrList(event: any): void {
    this.getLatestCrList.next(event);
  }

  _loadActiveTab(event: any): void {
    this.activateMainTab.next(event);
  }
}
