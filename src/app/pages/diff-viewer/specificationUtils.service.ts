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

  constructor() {}

  saveVerions(event: SpecVersion[]): void {
    this.loadVersions.next(event);
  }

  saveSpecList(event: any): void {
    this.loadSpecList.next(event);
  }
}
