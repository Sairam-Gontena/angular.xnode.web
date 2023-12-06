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


  private saveSpecVersion: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public getMeSpecVersion: Observable<string> = this.saveSpecVersion.asObservable();

  private getMeSpec: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public getSpecBasedOnVersionID: Observable<any> = this.getMeSpec.asObservable();

  _openCommentsPanel(event: boolean): void {
    this.openPanel.next(event);
  }

  _tabToActive(event: string): void {
    this.activeTab.next(event);
  }
  _getSpecBasedOnVersionID(event: string): void {
    this.getMeSpec.next(event);
  }

  _saveSpecVersion(event: any): void {
    this.saveSpecVersion.next(event);
  }
}
