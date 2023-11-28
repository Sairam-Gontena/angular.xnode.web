import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpecUtilsService {
    private openPanel: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public openCommentsPanel: Observable<boolean> = this.openPanel.asObservable();

    private activeTab: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public tabToActive: Observable<string> = this.activeTab.asObservable();

    _openCommentsPanel(event: boolean): void {
        this.openPanel.next(event);
    }

    _tabToActive(event: string): void {
        this.activeTab.next(event);
    }
}