import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endPoint = "https://xpilot.azurewebsites.net/crud";
  private open: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public openSubmenu: Observable<boolean> = this.open.asObservable();
  constructor() {
  }

  falseOpen() {
    this.open.next(false);
  }

  trueOpen() {
    this.open.next(true);
  }

  getID(email: string) {
    return axios.get('https://xpilot.azurewebsites.net/crud/get_metadata/' + email);
  }

  getUsecase(email: String, id: String) {
    return axios.get('https://xpilot.azurewebsites.net/crud/retrive_insights/' + email + "/" + id, {
    });
  }

  get(url: string) {
    return axios.get(this.endPoint + url, {
    });
  }

  getConversation(email: String, id: String) {
    return axios.get('https://xpilot.azurewebsites.net/crud/get_conversation/' + email + "/" + id);
  }


}
