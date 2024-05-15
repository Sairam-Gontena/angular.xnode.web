import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpecVersion } from 'src/models/spec-versions';

@Injectable({
  providedIn: 'root',
})
export class SpecificationUtilsService {
  private loadVersions: BehaviorSubject<SpecVersion[]> = new BehaviorSubject<
    SpecVersion[]
  >([]);
  public getMeVersions: Observable<SpecVersion[]> =
    this.loadVersions.asObservable();

  private loadSpecList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public getMeSpecList: Observable<any> = this.loadSpecList.asObservable();

  private loadCrList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public getMeCrList: Observable<any> = this.loadCrList.asObservable();

  private loadCommentList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public getMeCommentList: Observable<any> =
    this.loadCommentList.asObservable();

  private loadTaskList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public getMeTaskList: Observable<any> = this.loadTaskList.asObservable();

  private showConversationPanel: BehaviorSubject<any> =
    new BehaviorSubject<any>(null);
  public _openConversationPanel: Observable<any> =
    this.showConversationPanel.asObservable();

  private triggerCloseOverlay: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public closeOverlayObserver: Observable<any> = this.triggerCloseOverlay.asObservable();
  constructor() { }

  saveVerions(event: SpecVersion[]): void {
    this.loadVersions.next(event);
  }

  saveSpecList(event: any): void {
    this.loadSpecList.next(event);
  }

  saveCommentList(event: any): void {
    this.loadCommentList.next(event);
  }

  saveTaskList(event: any): void {
    this.loadTaskList.next(event);
  }

  saveCrList(event: any): void {
    this.loadCrList.next(event);
  }

  openConversationPanel(event: any): void {
    this.showConversationPanel.next(event);
  }

  triggerSpecOverlays(event: any): void {
    this.triggerCloseOverlay.next(event);
  }
}
