import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endPoint = environment.xpilotUrl + "crud";
  private open: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public openSubmenu: Observable<boolean> = this.open.asObservable();

  constructor() {
  }

  falseOpen() {
    this.open.next(false);
  }

  trueOpen() {
    this.open.next(true);
  }
  // Temporary
  publishApp(body: any) {
    return axios.post(environment.publishUrl, body);
  }

  get(url: string) {
    return axios.get(this.endPoint + url, {
    });
  }

}
